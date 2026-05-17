# Untangle

**Untangle** is a smart consultation and booking system for textured-hair stylists. Clients complete a structured hair intake form before their appointment. Stylists receive a full profile — hair type, density, porosity, treatment history, preparation status — along with an estimated service time and suggested price range, before anyone sits in the chair.

---

## The problem it solves

- Clients underestimating their hair density and booking short slots for long styles
- Arriving unprepared with unwashed, matted hair
- Stylists having to guess the price mid-appointment
- Surprise chemical damage discovered at the chair

Untangle moves the consultation out of the chair and into a structured digital form.

---

## How it works

1. **Stylist creates an account** and sets up their services with base prices and estimated hours
2. **Stylist shares their intake link** — `untangle.app/intake/your-name` — with a client before the appointment
3. **Client fills out a 5-step intake form** covering hair details, history, preparation status, and style goals
4. **Untangle estimates** service time, prep time, and suggested price range using rule-based logic
5. **Stylist reviews** the client profile on their dashboard before confirming the appointment

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS with custom petal color palette |
| Icons | Lucide React |
| HTTP client | Axios |
| Backend | FastAPI (Python) on `localhost:8000` |
| Database | SQLite (dev) / PostgreSQL (prod) via SQLAlchemy |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| Estimation | Rule-based logic — no ML required |

---

## Getting started

### Prerequisites

- Node.js 18+
- Python 3.11+

### Frontend

```bash
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

### Backend

```bash
cd backend
bash start.sh
```

Runs at [http://localhost:8000](http://localhost:8000). API docs at [http://localhost:8000/docs](http://localhost:8000/docs).

The backend creates a `untangle.db` SQLite file automatically on first run. No setup required.

### Environment variables

`.env.local` (frontend):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Backend environment variables (all optional):
```
DATABASE_URL=postgresql://user:password@localhost/untangle   # defaults to sqlite:///./untangle.db
SECRET_KEY=your-secret-key-here                              # defaults to a dev key
RESEND_API_KEY=re_xxxxxxxx                                   # if unset, emails print to the console
EMAIL_FROM=Untangle <hello@yourdomain.com>                   # must be a Resend-verified domain
FRONTEND_URL=http://localhost:3000                           # used in email links
```

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build production bundle |
| `npm start` | Run production server |

---

## Project structure

```
untangle/
├── app/                                       # Next.js App Router pages
│   ├── page.js                                # Landing page
│   ├── login/page.js                          # Login
│   ├── signup/page.js                         # Stylist signup with slug selection
│   ├── onboarding/page.js                     # Service setup after signup
│   ├── dashboard/
│   │   ├── page.js                            # Intake list + summary stats
│   │   ├── services/page.js                   # Manage services (CRUD)
│   │   └── intake/[token]/page.js             # Single intake detail + decision actions
│   └── intake/
│       └── [slug]/
│           ├── page.js                        # Client: choose service, enter details, pick appointment time
│           └── [token]/
│               ├── page.js                    # Client: 5-step hair intake wizard
│               └── done/page.js               # Client: confirmation + estimate
├── lib/
│   └── api.js                                 # Axios client with JWT interceptor
├── backend/
│   ├── main.py                                # FastAPI routes + lifespan startup
│   ├── models.py                              # SQLAlchemy ORM models
│   ├── schemas.py                             # Pydantic request/response schemas
│   ├── database.py                            # DB connection + session factory
│   ├── auth.py                                # JWT creation + verification
│   ├── estimator.py                           # Complexity estimation logic
│   ├── email_service.py                       # Resend wrapper with console-log fallback
│   ├── email_templates.py                     # HTML/text templates for all 4 emails
│   ├── scheduler.py                           # APScheduler jobs (24h reminder, 48h follow-up)
│   ├── tests/                                 # pytest suite
│   └── requirements.txt
└── tailwind.config.js
```

---

## The intake wizard (5 steps)

| Step | Fields |
|---|---|
| Hair details | Length, density, porosity, strand thickness, condition |
| Hair history | Last relaxer, last color, last heat treatment, breakage |
| Preparation | Washed, detangled, product-free (day of appointment) |
| Goals | Style inspiration link, preferred duration, scalp issues |
| Review | Full summary before submit |

---

## Estimation logic

All estimation is rule-based in [`backend/estimator.py`](backend/estimator.py). No machine learning.

```
estimated_hours = (base_service_hours
                  × length_mult × density_mult × thickness_mult
                  + condition_extra + porosity_extra + relaxer_extra + color_extra + breakage_extra)
                  rounded to the nearest 0.5h

prep_time       = +20m if not washed, +30m if not detangled, +10m if product-heavy
price_range     = base_price × the same multipliers, plus flat extras, then ±10%
complexity_score = weighted sum of all factors, capped at 10
```

Multipliers:

| Factor | Values |
|---|---|
| Length (shoulder = 1.0) | 0.7 (TWA) → 1.6 (waist+) |
| Density | 0.85 (low) / 1.0 (medium) / 1.3 (high) |
| Thickness | 0.9 (fine) / 1.0 (medium) / 1.2 (coarse) |

Flat hour extras:

| Factor | Value |
|---|---|
| Condition | 0h (healthy) · 0.5h (dry) · 0.75h (transitioning) · 1.0h (damaged) |
| Porosity (low) | +0.25h |
| Last relaxer < 6 months / 6–12 months | +0.5h / +0.25h |
| Last color < 3 months / 3–6 months | +0.5h / +0.25h |
| Has breakage | +0.25h |

---

## Email notifications

Untangle sends four transactional emails through [Resend](https://resend.com). Two fire synchronously via FastAPI `BackgroundTasks`; two are time-based and dispatched by [APScheduler](https://apscheduler.readthedocs.io/) running in-process.

| # | Trigger | Goes to | Mechanism |
|---|---|---|---|
| 1 | Client submits intake | Stylist | `BackgroundTasks` on `POST /intake/{token}/submit` |
| 2 | Stylist updates decision (confirm / reschedule / adjust price / request prep) | Client | `BackgroundTasks` on `PATCH /dashboard/intakes/{token}/decision` |
| 3 | 24 hours before the appointment | Client | APScheduler every 15 min; idempotent via `reminder_sent_at` |
| 4 | 48 hours after a pending intake with no stylist action | Stylist | APScheduler every 1 hour; idempotent via `followup_sent_at` |

Templates live in [`backend/email_templates.py`](backend/email_templates.py). Without `RESEND_API_KEY` set, sends are logged to the terminal instead — useful for iterating on templates locally without burning quota.

The 24-hour reminder reads the prep checklist (`is_washed`, `is_detangled`, `is_product_free`) from the submitted hair profile and only nags the client about steps they actually flagged as incomplete.

---

## API reference

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Create stylist account |
| `POST` | `/auth/login` | — | Get JWT |
| `GET` | `/stylist/{slug}` | — | Public profile + service list |
| `GET` | `/stylist/me/profile` | Stylist | Read own profile |
| `PUT` | `/stylist/me/profile` | Stylist | Update bio, location, instagram |
| `GET` | `/services` | Stylist | List own services |
| `POST` | `/services` | Stylist | Add a service |
| `PUT` | `/services/{id}` | Stylist | Edit a service |
| `DELETE` | `/services/{id}` | Stylist | Remove a service |
| `POST` | `/intake/{slug}/start` | — | Create intake session (captures appointment time), return token |
| `GET` | `/intake/{token}` | — | Get session info |
| `POST` | `/intake/{token}/submit` | — | Submit hair profile, run estimation, email stylist |
| `GET` | `/dashboard/intakes` | Stylist | All submissions |
| `GET` | `/dashboard/intakes/{token}` | Stylist | Single submission detail |
| `PATCH` | `/dashboard/intakes/{token}/decision` | Stylist | Confirm / reschedule / adjust price / request prep, email client |

---

## Testing

Backend tests use pytest with an in-memory SQLite per test (via `StaticPool` so all sessions see the same DB). `email_service.send_email` is auto-mocked across the whole suite so no test can accidentally hit Resend.

```bash
cd backend
./venv/bin/python -m pytest -q
```

Current coverage:

| File | What it locks down |
|---|---|
| [`tests/test_estimator.py`](backend/tests/test_estimator.py) | Length, density, thickness multipliers; prep-time accumulation; complexity score cap; defensive defaults |
| [`tests/test_scheduler.py`](backend/tests/test_scheduler.py) | Idempotency of both scheduled jobs; window/precondition skip behavior |
| [`tests/test_decision_auth.py`](backend/tests/test_decision_auth.py) | Stylist A can update their own intake; Stylist B gets a 404 and the data is actually unchanged |

---

## License

MIT

## Screenshots

<img width="1470" height="884" alt="Screenshot 2026-03-16 at 11 23 46 AM" src="https://github.com/user-attachments/assets/81ffaca0-99f4-4bfe-993b-511eade7466b" />


<img width="1470" height="885" alt="Screenshot 2026-03-16 at 11 20 42 AM" src="https://github.com/user-attachments/assets/1d3dd990-9c76-4e15-969b-858a686f6f07" />
