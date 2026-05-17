"""
Idempotency tests for scheduler jobs.

Both send_24h_reminders and send_48h_followups must send each email at most
once — re-running the job should be a no-op. The contract is enforced by the
reminder_sent_at / followup_sent_at columns.
"""
import uuid
from datetime import datetime, timedelta, timezone

import pytest

import scheduler as scheduler_module
import models


def _utcnow():
    return datetime.now(timezone.utc)


def _make_user(db, name="Sade Stylist", email="sade@example.com", role="stylist"):
    user = models.User(
        id=str(uuid.uuid4()),
        email=email,
        password_hash="x",
        name=name,
        role=role,
    )
    db.add(user)
    db.flush()
    return user


def _make_stylist(db, name="Sade Stylist", email="sade@example.com", slug="sade"):
    user = _make_user(db, name=name, email=email)
    profile = models.StylistProfile(
        id=str(uuid.uuid4()),
        user_id=user.id,
        slug=slug,
    )
    db.add(profile)
    db.flush()
    return profile


def _make_service(db, stylist_id):
    svc = models.Service(
        id=str(uuid.uuid4()),
        stylist_id=stylist_id,
        name="Box braids",
        base_price=200.0,
        base_time_hours=4.0,
    )
    db.add(svc)
    db.flush()
    return svc


def _make_hair_profile(db, session_id):
    hp = models.HairProfile(
        id=str(uuid.uuid4()),
        session_id=session_id,
        length="shoulder", density="medium", porosity="medium",
        thickness="medium", condition="healthy",
        last_relaxer="never", last_color="never", last_heat="rarely",
        has_breakage=False,
        is_washed=False, is_detangled=True, is_product_free=True,
    )
    db.add(hp)
    db.flush()
    return hp


def _patch_scheduler_session(monkeypatch, session_factory):
    """Point scheduler.SessionLocal at the test in-memory sessionmaker."""
    monkeypatch.setattr(scheduler_module, "SessionLocal", session_factory)


# ── 24h reminder ──────────────────────────────────────────────────────────────

def test_24h_reminder_sends_for_intake_in_window(db, session_factory, monkeypatch, captured_emails):
    _patch_scheduler_session(monkeypatch, session_factory)

    profile = _make_stylist(db)
    svc = _make_service(db, profile.id)
    appt = _utcnow() + timedelta(hours=24)

    session = models.IntakeSession(
        id=str(uuid.uuid4()),
        token=str(uuid.uuid4()),
        stylist_id=profile.id,
        service_id=svc.id,
        client_name="Jordan",
        client_email="jordan@example.com",
        appointment_at=appt,
        status="confirmed",
    )
    db.add(session)
    db.flush()
    _make_hair_profile(db, session.id)
    db.commit()

    scheduler_module.send_24h_reminders()
    assert len(captured_emails) == 1
    assert captured_emails[0]["to"] == "jordan@example.com"
    assert "tomorrow" in captured_emails[0]["text"].lower()


def test_24h_reminder_is_idempotent(db, session_factory, monkeypatch, captured_emails):
    """Running the job twice must not send twice."""
    _patch_scheduler_session(monkeypatch, session_factory)

    profile = _make_stylist(db)
    svc = _make_service(db, profile.id)
    session = models.IntakeSession(
        id=str(uuid.uuid4()),
        token=str(uuid.uuid4()),
        stylist_id=profile.id,
        service_id=svc.id,
        client_name="Jordan",
        client_email="jordan@example.com",
        appointment_at=_utcnow() + timedelta(hours=24),
        status="confirmed",
    )
    db.add(session)
    db.flush()
    _make_hair_profile(db, session.id)
    db.commit()

    scheduler_module.send_24h_reminders()
    scheduler_module.send_24h_reminders()
    scheduler_module.send_24h_reminders()

    assert len(captured_emails) == 1


def test_24h_reminder_skips_appointments_outside_window(db, session_factory, monkeypatch, captured_emails):
    _patch_scheduler_session(monkeypatch, session_factory)

    profile = _make_stylist(db)
    svc = _make_service(db, profile.id)
    for label, hours_out in [("too_early", 30), ("too_late", 2)]:
        session = models.IntakeSession(
            id=str(uuid.uuid4()),
            token=str(uuid.uuid4()),
            stylist_id=profile.id,
            service_id=svc.id,
            client_name=label,
            client_email=f"{label}@example.com",
            appointment_at=_utcnow() + timedelta(hours=hours_out),
            status="confirmed",
        )
        db.add(session)
        db.flush()
        _make_hair_profile(db, session.id)
    db.commit()

    scheduler_module.send_24h_reminders()
    assert captured_emails == []


def test_24h_reminder_skips_intake_without_client_email(db, session_factory, monkeypatch, captured_emails):
    _patch_scheduler_session(monkeypatch, session_factory)

    profile = _make_stylist(db)
    svc = _make_service(db, profile.id)
    session = models.IntakeSession(
        id=str(uuid.uuid4()),
        token=str(uuid.uuid4()),
        stylist_id=profile.id,
        service_id=svc.id,
        client_name="Anon",
        client_email=None,
        appointment_at=_utcnow() + timedelta(hours=24),
        status="confirmed",
    )
    db.add(session)
    db.flush()
    _make_hair_profile(db, session.id)
    db.commit()

    scheduler_module.send_24h_reminders()
    assert captured_emails == []


# ── 48h follow-up ─────────────────────────────────────────────────────────────

def test_48h_followup_sends_for_pending_intake_older_than_48h(db, session_factory, monkeypatch, captured_emails):
    _patch_scheduler_session(monkeypatch, session_factory)

    profile = _make_stylist(db, email="stylist@example.com")
    svc = _make_service(db, profile.id)
    session = models.IntakeSession(
        id=str(uuid.uuid4()),
        token=str(uuid.uuid4()),
        stylist_id=profile.id,
        service_id=svc.id,
        client_name="Jordan",
        client_email="jordan@example.com",
        status="pending",
        created_at=_utcnow() - timedelta(hours=72),
    )
    db.add(session)
    db.flush()
    _make_hair_profile(db, session.id)
    db.commit()

    scheduler_module.send_48h_followups()
    assert len(captured_emails) == 1
    assert captured_emails[0]["to"] == "stylist@example.com"


def test_48h_followup_is_idempotent(db, session_factory, monkeypatch, captured_emails):
    _patch_scheduler_session(monkeypatch, session_factory)

    profile = _make_stylist(db, email="stylist@example.com")
    svc = _make_service(db, profile.id)
    session = models.IntakeSession(
        id=str(uuid.uuid4()),
        token=str(uuid.uuid4()),
        stylist_id=profile.id,
        service_id=svc.id,
        client_name="Jordan",
        client_email="jordan@example.com",
        status="pending",
        created_at=_utcnow() - timedelta(hours=72),
    )
    db.add(session)
    db.flush()
    _make_hair_profile(db, session.id)
    db.commit()

    scheduler_module.send_48h_followups()
    scheduler_module.send_48h_followups()

    assert len(captured_emails) == 1


def test_48h_followup_skips_already_reviewed_intake(db, session_factory, monkeypatch, captured_emails):
    """If the stylist has acted on the intake, the nudge isn't relevant."""
    _patch_scheduler_session(monkeypatch, session_factory)

    profile = _make_stylist(db, email="stylist@example.com")
    svc = _make_service(db, profile.id)
    session = models.IntakeSession(
        id=str(uuid.uuid4()),
        token=str(uuid.uuid4()),
        stylist_id=profile.id,
        service_id=svc.id,
        client_name="Jordan",
        client_email="jordan@example.com",
        status="confirmed",   # already acted on
        created_at=_utcnow() - timedelta(hours=72),
    )
    db.add(session)
    db.flush()
    _make_hair_profile(db, session.id)
    db.commit()

    scheduler_module.send_48h_followups()
    assert captured_emails == []


def test_48h_followup_skips_intake_client_never_submitted(db, session_factory, monkeypatch, captured_emails):
    """Don't nudge stylist about an intake the client abandoned mid-wizard."""
    _patch_scheduler_session(monkeypatch, session_factory)

    profile = _make_stylist(db, email="stylist@example.com")
    svc = _make_service(db, profile.id)
    session = models.IntakeSession(
        id=str(uuid.uuid4()),
        token=str(uuid.uuid4()),
        stylist_id=profile.id,
        service_id=svc.id,
        client_name="Jordan",
        client_email="jordan@example.com",
        status="pending",
        created_at=_utcnow() - timedelta(hours=72),
    )
    db.add(session)
    db.commit()
    # Deliberately no hair_profile.

    scheduler_module.send_48h_followups()
    assert captured_emails == []
