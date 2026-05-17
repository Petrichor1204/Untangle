# Untangle Backend

FastAPI backend for the Untangle stylist-intake app. See the [root README](../README.md) for the product overview, full API reference, and email notification details. This file covers backend-specific setup and layout.

## Run

```bash
cd backend
bash start.sh
```

The script creates a `venv/` on first run, installs deps, and starts uvicorn on `http://127.0.0.1:8000`. API docs at `/docs`.

To run without the script:

```bash
./venv/bin/uvicorn main:app --reload --port 8000
```

## Layout

| File | Purpose |
|---|---|
| `main.py` | All FastAPI routes, SQLite-safe migrations, and the lifespan hook that starts APScheduler |
| `models.py` | SQLAlchemy ORM models (`User`, `StylistProfile`, `Service`, `IntakeSession`, `HairProfile`, `ComplexityEstimate`) |
| `schemas.py` | Pydantic request/response schemas |
| `database.py` | Engine + `SessionLocal` + `get_db` dependency |
| `auth.py` | JWT creation/verification + `require_stylist` dependency |
| `estimator.py` | Rule-based complexity estimation — see root README for the formula |
| `email_service.py` | `send_email()` — Resend if `RESEND_API_KEY` is set, otherwise console fallback |
| `email_templates.py` | HTML/text bodies for the 4 transactional emails |
| `scheduler.py` | APScheduler jobs: 24h appointment reminder, 48h stylist follow-up |
| `tests/` | pytest suite |

## Environment

All env vars are optional in development:

```
DATABASE_URL=sqlite:///./untangle.db            # default; set to a postgres URL in prod
SECRET_KEY=...                                  # JWT signing key; defaults to a dev value
RESEND_API_KEY=re_...                           # if unset, emails print to stdout
EMAIL_FROM=Untangle <hello@yourdomain.com>      # must be Resend-verified
FRONTEND_URL=http://localhost:3000              # used to build dashboard links in emails
```

## Migrations

Schema changes are applied at startup by `_run_migrations()` in `main.py` — a list of `ALTER TABLE ... ADD COLUMN` statements that fail silently if the column already exists. This keeps SQLite dev databases moving without a separate migration tool. When moving to Postgres in production, swap this for Alembic.

## Tests

```bash
./venv/bin/python -m pytest -q
```

Tests use an in-memory SQLite per test and auto-mock `email_service.send_email`. See [the root README](../README.md#testing) for what each suite covers.
