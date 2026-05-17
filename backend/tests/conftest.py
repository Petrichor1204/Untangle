"""
Shared pytest fixtures. Each test gets a fresh in-memory SQLite so they're
isolated; email_service.send_email is replaced with a recorder so no test
can hit the network.
"""
import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

# Keep the production DB out of test runs. main.py reads DATABASE_URL at import,
# so set this before importing anything that touches the engine.
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from database import Base  # noqa: E402
import email_service  # noqa: E402
import scheduler as scheduler_module  # noqa: E402


@pytest.fixture
def engine():
    # StaticPool keeps all connections on a single underlying SQLite
    # in-memory DB so the schema is visible across sessions.
    eng = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(eng)
    yield eng
    eng.dispose()


@pytest.fixture
def session_factory(engine):
    return sessionmaker(bind=engine, autoflush=False, autocommit=False)


@pytest.fixture
def db(session_factory):
    s = session_factory()
    try:
        yield s
    finally:
        s.close()


@pytest.fixture(autouse=True)
def captured_emails(monkeypatch):
    """Auto-applied so no test can accidentally call out to Resend."""
    sent = []

    def fake_send(to, subject, html, text=None):
        sent.append({"to": to, "subject": subject, "html": html, "text": text})
        return True

    monkeypatch.setattr(email_service, "send_email", fake_send)
    # Scheduler imports send_email from email_service into its own namespace —
    # patch both spots.
    monkeypatch.setattr(scheduler_module.email_service, "send_email", fake_send)
    return sent


@pytest.fixture
def client(session_factory):
    """FastAPI TestClient with get_db overridden to use the in-memory DB."""
    from main import app
    from database import get_db

    def override_get_db():
        s = session_factory()
        try:
            yield s
        finally:
            s.close()

    app.dependency_overrides[get_db] = override_get_db
    # Don't use `with TestClient(app)` — that would trigger the lifespan
    # handler and spin up the real APScheduler in a background thread.
    c = TestClient(app)
    try:
        yield c
    finally:
        app.dependency_overrides.clear()
