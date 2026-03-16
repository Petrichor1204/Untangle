# Hairly

**Hairly** is a smart consultation and booking system for textured-hair stylists. Clients complete a structured hair intake form before their appointment. Stylists receive a full profile — hair type, density, porosity, treatment history, preparation status — along with an estimated service time and suggested price range, before anyone sits in the chair.

---

## The problem it solves

- Clients underestimating their hair density and booking short slots for long styles
- Arriving unprepared with unwashed, matted hair
- Stylists having to guess the price mid-appointment
- Surprise chemical damage discovered at the chair

Hairly moves the consultation out of the chair and into a structured digital form.

---

## How it works

1. **Stylist creates an account** and sets up their services with base prices and estimated hours
2. **Stylist shares their intake link** — `hairly.app/intake/your-name` — with a client before the appointment
3. **Client fills out a 5-step intake form** covering hair details, history, preparation status, and style goals
4. **Hairly estimates** service time, prep time, and suggested price range using rule-based logic
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

The backend creates a `hairly.db` SQLite file automatically on first run. No setup required.

### Environment variables

`.env.local` (frontend):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Backend environment variables (optional):
```
DATABASE_URL=postgresql://user:password@localhost/hairly   # defaults to SQLite
SECRET_KEY=your-secret-key-here                            # defaults to dev key
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
hairly/
├── app/                              # Next.js App Router pages
│   ├── page.js                       # Landing page (stylist marketing)
│   ├── login/page.js                 # Login
│   ├── signup/page.js                # Stylist signup with slug selection
│   ├── onboarding/page.js            # Service setup after signup
│   ├── dashboard/page.js             # Stylist dashboard — intake link + submissions
│   └── intake/
│       └── [slug]/
│           ├── page.js               # Client: choose service + enter details
│           └── [token]/
│               ├── page.js           # Client: 5-step hair intake wizard
│               └── done/page.js      # Client: confirmation + estimate
├── lib/
│   └── api.js                        # Axios client with JWT interceptor
├── backend/
│   ├── main.py                       # All FastAPI routes
│   ├── models.py                     # SQLAlchemy ORM models
│   ├── schemas.py                    # Pydantic request/response schemas
│   ├── database.py                   # DB connection + session factory
│   ├── auth.py                       # JWT creation + verification
│   ├── estimator.py                  # Complexity estimation logic
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
estimated_hours = base_service_hours × length_multiplier × density_multiplier + condition_extra
price_range     = [base_price × 0.9, base_price × 1.1] adjusted by same multipliers
prep_time       = +20 min if not washed, +30 min if not detangled, +10 min if product-heavy
```

Multipliers:

| Factor | Low | Medium | High |
|---|---|---|---|
| Length (shoulder = 1.0) | 0.7 (TWA) → 1.6 (waist+) | — | — |
| Density | 0.85 | 1.0 | 1.3 |
| Condition extra | 0h (healthy) | 0.5h (dry) / 0.75h (transitioning) | 1.0h (damaged) |

---

## API reference

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Create stylist account |
| `POST` | `/auth/login` | — | Get JWT |
| `GET` | `/stylist/{slug}` | — | Public profile + service list |
| `GET` | `/services` | Stylist | List own services |
| `POST` | `/services` | Stylist | Add a service |
| `PUT` | `/services/{id}` | Stylist | Edit a service |
| `DELETE` | `/services/{id}` | Stylist | Remove a service |
| `POST` | `/intake/{slug}/start` | — | Create intake session, return token |
| `GET` | `/intake/{token}` | — | Get session info |
| `POST` | `/intake/{token}/submit` | — | Submit hair profile, run estimation |
| `GET` | `/dashboard/intakes` | Stylist | All submissions |
| `GET` | `/dashboard/intakes/{token}` | Stylist | Single submission detail |

---

## License

MIT

## Screenshots

<img width="1470" height="956" alt="Screenshot 2026-03-16 at 11 18 57 AM" src="https://github.com/user-attachments/assets/227b8faa-d1eb-469c-8646-85af48c22d0e" />

<img width="1470" height="885" alt="Screenshot 2026-03-16 at 11 20 42 AM" src="https://github.com/user-attachments/assets/1d3dd990-9c76-4e15-969b-858a686f6f07" />
