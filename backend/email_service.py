"""
Lightweight email sender. Uses Resend when RESEND_API_KEY is set; otherwise
logs the email to stdout so the rest of the app can be developed offline.
"""
import logging
import os

logger = logging.getLogger(__name__)

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
EMAIL_FROM = os.getenv("EMAIL_FROM", "Untangle <onboarding@resend.dev>")

_resend = None
if RESEND_API_KEY:
    import resend as _resend
    _resend.api_key = RESEND_API_KEY


def send_email(to: str | None, subject: str, html: str, text: str | None = None) -> bool:
    if not to:
        logger.warning("send_email called without recipient — skipping")
        return False

    if _resend is None:
        preview = (text or html)[:240].replace("\n", " ")
        print(
            f"[email-dev] no RESEND_API_KEY set — would have sent:\n"
            f"  to:      {to}\n"
            f"  from:    {EMAIL_FROM}\n"
            f"  subject: {subject}\n"
            f"  body:    {preview}",
            flush=True,
        )
        return True

    try:
        _resend.Emails.send({
            "from": EMAIL_FROM,
            "to": to,
            "subject": subject,
            "html": html,
            "text": text or "",
        })
        return True
    except Exception as e:
        logger.error("Failed to send email to %s: %s", to, e)
        return False
