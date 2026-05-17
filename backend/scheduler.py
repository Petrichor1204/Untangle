"""
APScheduler in-process jobs for time-based emails:
  #3 24h appointment reminder to client
  #4 48h follow-up nudge to stylist
"""
import logging
from datetime import datetime, timedelta, timezone

from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy import and_

from database import SessionLocal
import email_service
import email_templates
import models

logger = logging.getLogger(__name__)
scheduler = BackgroundScheduler(timezone="UTC")


def _now() -> datetime:
    return datetime.now(timezone.utc)


def send_24h_reminders() -> None:
    """Find intakes ~24h from their appointment_at and send prep reminders."""
    db = SessionLocal()
    try:
        now = _now()
        window_start = now + timedelta(hours=23, minutes=45)
        window_end = now + timedelta(hours=24, minutes=15)

        sessions = (
            db.query(models.IntakeSession)
            .filter(
                models.IntakeSession.appointment_at.isnot(None),
                models.IntakeSession.appointment_at >= window_start,
                models.IntakeSession.appointment_at <= window_end,
                models.IntakeSession.reminder_sent_at.is_(None),
                models.IntakeSession.client_email.isnot(None),
            )
            .all()
        )

        for s in sessions:
            hair = s.hair_profile
            missing = []
            if hair:
                if not hair.is_washed: missing.append("Wash your hair the day before")
                if not hair.is_detangled: missing.append("Detangle from tips to roots")
                if not hair.is_product_free: missing.append("Skip heavy oils, creams, and gels")

            appt_local = s.appointment_at.strftime("%-I:%M %p")
            payload = email_templates.appointment_reminder_for_client(
                client_name=s.client_name or "there",
                stylist_name=s.stylist.user.name,
                appointment_at_human=appt_local,
                missing_prep=missing,
            )
            sent = email_service.send_email(
                s.client_email, payload["subject"], payload["html"], payload["text"],
            )
            if sent:
                s.reminder_sent_at = now
                db.commit()
                logger.info("Sent 24h reminder for intake %s", s.token)
    except Exception:
        logger.exception("send_24h_reminders failed")
    finally:
        db.close()


def send_48h_followups() -> None:
    """Find pending intakes older than 48h and nudge the stylist."""
    db = SessionLocal()
    try:
        now = _now()
        cutoff = now - timedelta(hours=48)

        sessions = (
            db.query(models.IntakeSession)
            .filter(
                models.IntakeSession.created_at <= cutoff,
                models.IntakeSession.status == "pending",
                models.IntakeSession.followup_sent_at.is_(None),
            )
            .all()
        )

        for s in sessions:
            if not s.hair_profile:
                continue  # client never finished — don't nudge stylist
            stylist_user = s.stylist.user
            payload = email_templates.followup_for_stylist(
                stylist_name=stylist_user.name,
                client_name=s.client_name or "A client",
                token=s.token,
            )
            sent = email_service.send_email(
                stylist_user.email, payload["subject"], payload["html"], payload["text"],
            )
            if sent:
                s.followup_sent_at = now
                db.commit()
                logger.info("Sent 48h follow-up for intake %s", s.token)
    except Exception:
        logger.exception("send_48h_followups failed")
    finally:
        db.close()


def start_scheduler() -> None:
    if scheduler.running:
        return
    scheduler.add_job(send_24h_reminders, "interval", minutes=15, id="reminders_24h", replace_existing=True)
    scheduler.add_job(send_48h_followups, "interval", hours=1, id="followups_48h", replace_existing=True)
    scheduler.start()
    logger.info("APScheduler started: 24h reminders every 15min, 48h follow-ups every 1h")
