"""
HTML/text templates for transactional emails. Each builder returns a dict
with `subject`, `html`, and `text` keys ready for email_service.send_email.
"""
import os

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


def _wrap(title: str, body_html: str) -> str:
    return f"""
    <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#3a2e26;background:#fffaf3;">
      <h1 style="font-size:26px;margin:0;color:#8b6f4b;letter-spacing:-0.5px;">Untangle</h1>
      <h2 style="font-size:20px;margin:24px 0 12px;font-weight:600;">{title}</h2>
      {body_html}
      <p style="margin-top:32px;font-size:12px;color:#a89784;">Sent by Untangle</p>
    </div>
    """


def new_intake_for_stylist(
    stylist_name: str,
    client_name: str,
    token: str,
    estimated_hours: float,
    complexity_score: float,
) -> dict:
    link = f"{FRONTEND_URL}/dashboard/intake/{token}"
    body = f"""
      <p>Hi {stylist_name},</p>
      <p><strong>{client_name}</strong> just submitted an intake.</p>
      <table style="margin:16px 0;border-collapse:collapse;">
        <tr><td style="padding:4px 16px 4px 0;color:#7c6450;">Estimated service:</td><td><strong>{estimated_hours} hours</strong></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#7c6450;">Complexity score:</td><td><strong>{complexity_score} / 10</strong></td></tr>
      </table>
      <p><a href="{link}" style="display:inline-block;background:#8b6f4b;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:600;">View full intake</a></p>
    """
    text = (
        f"Hi {stylist_name},\n\n"
        f"{client_name} just submitted an intake.\n"
        f"Estimated service: {estimated_hours} hours\n"
        f"Complexity score: {complexity_score} / 10\n\n"
        f"View full intake: {link}\n"
    )
    return {"subject": f"New intake from {client_name}", "html": _wrap("New intake submitted", body), "text": text}


STATUS_HEADLINES = {
    "confirmed": "Your appointment is confirmed",
    "reviewed": "Your stylist has reviewed your intake",
    "rescheduled": "Your stylist wants to reschedule",
    "prep_requested": "Your stylist sent prep instructions",
}


def decision_for_client(
    client_name: str,
    stylist_name: str,
    status: str,
    price_min: float | None,
    price_max: float | None,
    stylist_note: str | None,
) -> dict:
    headline = STATUS_HEADLINES.get(status, "Update on your intake")

    price_html = ""
    if price_min is not None and price_max is not None:
        price_html = (
            f'<p style="margin:12px 0;color:#7c6450;">Final price range: '
            f'<strong style="color:#3a2e26;">${int(price_min)}–${int(price_max)}</strong></p>'
        )

    note_html = ""
    if stylist_note:
        note_html = f"""
          <div style="margin:16px 0;padding:14px 16px;background:#f5ede0;border-left:3px solid #8b6f4b;border-radius:4px;">
            <p style="margin:0 0 4px;font-size:12px;color:#7c6450;text-transform:uppercase;letter-spacing:0.5px;">Note from {stylist_name}</p>
            <p style="margin:0;">{stylist_note}</p>
          </div>
        """

    body = f"""
      <p>Hi {client_name},</p>
      <p>{stylist_name} has updated your intake.</p>
      {price_html}
      {note_html}
    """

    text_parts = [
        f"Hi {client_name},",
        f"{stylist_name} has updated your intake.",
    ]
    if price_min is not None and price_max is not None:
        text_parts.append(f"Final price range: ${int(price_min)}–${int(price_max)}")
    if stylist_note:
        text_parts.append(f"\nNote from {stylist_name}:\n{stylist_note}")
    text = "\n".join(text_parts) + "\n"

    return {"subject": headline, "html": _wrap(headline, body), "text": text}


def appointment_reminder_for_client(
    client_name: str,
    stylist_name: str,
    appointment_at_human: str,
    missing_prep: list[str],
) -> dict:
    if missing_prep:
        items = "".join(f"<li>{p}</li>" for p in missing_prep)
        prep_block = f"""
          <p style="margin-top:20px;"><strong>Before your appointment, please:</strong></p>
          <ul style="margin:8px 0;padding-left:20px;">{items}</ul>
        """
        prep_text = "Before your appointment, please:\n" + "\n".join(f"- {p}" for p in missing_prep) + "\n"
    else:
        prep_block = '<p style="margin-top:20px;">You\'re all prepped. See you soon.</p>'
        prep_text = "You're all prepped. See you soon.\n"

    body = f"""
      <p>Hi {client_name},</p>
      <p>Quick reminder — your appointment with <strong>{stylist_name}</strong> is tomorrow at <strong>{appointment_at_human}</strong>.</p>
      {prep_block}
    """
    text = (
        f"Hi {client_name},\n\n"
        f"Reminder: your appointment with {stylist_name} is tomorrow at {appointment_at_human}.\n\n"
        f"{prep_text}"
    )
    return {"subject": f"Reminder: appointment tomorrow at {appointment_at_human}", "html": _wrap("Appointment tomorrow", body), "text": text}


def followup_for_stylist(stylist_name: str, client_name: str, token: str) -> dict:
    link = f"{FRONTEND_URL}/dashboard/intake/{token}"
    body = f"""
      <p>Hi {stylist_name},</p>
      <p><strong>{client_name}</strong>'s intake has been sitting for 48 hours without a response. A quick review or note keeps the experience feeling personal.</p>
      <p><a href="{link}" style="display:inline-block;background:#8b6f4b;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:600;">Review intake</a></p>
    """
    text = (
        f"Hi {stylist_name},\n\n"
        f"{client_name}'s intake has been sitting for 48 hours without a response.\n\n"
        f"Review it here: {link}\n"
    )
    return {"subject": f"Reminder: {client_name}'s intake is waiting", "html": _wrap("Intake awaiting review", body), "text": text}
