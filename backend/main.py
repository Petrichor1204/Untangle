"""
main.py — Untangle API v2
Run with:  uvicorn main:app --reload --port 8000
"""

from dotenv import load_dotenv
load_dotenv()  # load backend/.env into os.environ before any module reads it

import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import engine, get_db, Base
import models
import schemas
import auth
import email_service
import email_templates
import scheduler as scheduler_module
from estimator import estimate_complexity

# Create all tables on startup
Base.metadata.create_all(bind=engine)

# SQLite-safe migrations for new nullable columns
def _run_migrations():
    with engine.connect() as conn:
        for col, defn in [
            ("stylist_note", "TEXT"),
            ("adjusted_price_min", "REAL"),
            ("adjusted_price_max", "REAL"),
            ("appointment_at", "DATETIME"),
            ("reminder_sent_at", "DATETIME"),
            ("followup_sent_at", "DATETIME"),
        ]:
            try:
                conn.execute(text(f"ALTER TABLE intake_sessions ADD COLUMN {col} {defn}"))
                conn.commit()
            except Exception:
                pass  # Column already exists

_run_migrations()


@asynccontextmanager
async def lifespan(_: FastAPI):
    scheduler_module.start_scheduler()
    yield


app = FastAPI(title="Untangle API", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/")
def health():
    return {"status": "ok", "service": "Untangle API", "version": "2.0.0"}


# ── Auth ──────────────────────────────────────────────────────────────────────

@app.post("/auth/register", response_model=schemas.TokenResponse)
def register(req: schemas.RegisterRequest, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == req.email).first():
        raise HTTPException(400, "Email already registered")

    if req.role == "stylist":
        if not req.slug:
            raise HTTPException(400, "A URL slug is required for stylist accounts")
        slug = req.slug.lower().strip()
        if not slug.replace("-", "").isalnum():
            raise HTTPException(400, "Slug may only contain letters, numbers, and hyphens")
        if db.query(models.StylistProfile).filter(models.StylistProfile.slug == slug).first():
            raise HTTPException(400, "That URL slug is already taken")

    user = models.User(
        id=str(uuid.uuid4()),
        email=req.email,
        password_hash=auth.hash_password(req.password),
        name=req.name,
        role=req.role,
    )
    db.add(user)
    db.flush()

    stylist_slug = None
    if req.role == "stylist":
        profile = models.StylistProfile(
            id=str(uuid.uuid4()),
            user_id=user.id,
            slug=slug,
            location=req.location,
        )
        db.add(profile)
        stylist_slug = slug

    db.commit()
    db.refresh(user)

    token = auth.create_access_token({"sub": user.id})
    return schemas.TokenResponse(
        access_token=token,
        user_id=user.id,
        name=user.name,
        role=user.role,
        slug=stylist_slug,
    )


@app.post("/auth/login", response_model=schemas.TokenResponse)
def login(req: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user or not auth.verify_password(req.password, user.password_hash):
        raise HTTPException(401, "Invalid email or password")

    slug = user.stylist_profile.slug if user.stylist_profile else None
    token = auth.create_access_token({"sub": user.id})
    return schemas.TokenResponse(
        access_token=token,
        user_id=user.id,
        name=user.name,
        role=user.role,
        slug=slug,
    )


# ── Stylist public profile ────────────────────────────────────────────────────

@app.get("/stylist/{slug}", response_model=schemas.StylistPublicProfile)
def get_stylist_profile(slug: str, db: Session = Depends(get_db)):
    profile = db.query(models.StylistProfile).filter(models.StylistProfile.slug == slug).first()
    if not profile:
        raise HTTPException(404, "Stylist not found")
    return schemas.StylistPublicProfile(
        name=profile.user.name,
        slug=profile.slug,
        bio=profile.bio,
        location=profile.location,
        services=[schemas.ServiceOut.model_validate(s) for s in profile.services],
    )


# ── Services (stylist only) ───────────────────────────────────────────────────

@app.get("/services", response_model=list[schemas.ServiceOut])
def list_services(
    user: models.User = Depends(auth.require_stylist),
    db: Session = Depends(get_db),
):
    return db.query(models.Service).filter(
        models.Service.stylist_id == user.stylist_profile.id
    ).all()


@app.post("/services", response_model=schemas.ServiceOut)
def create_service(
    req: schemas.ServiceCreate,
    user: models.User = Depends(auth.require_stylist),
    db: Session = Depends(get_db),
):
    service = models.Service(
        id=str(uuid.uuid4()),
        stylist_id=user.stylist_profile.id,
        **req.model_dump(),
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@app.put("/services/{service_id}", response_model=schemas.ServiceOut)
def update_service(
    service_id: str,
    req: schemas.ServiceUpdate,
    user: models.User = Depends(auth.require_stylist),
    db: Session = Depends(get_db),
):
    service = db.query(models.Service).filter(
        models.Service.id == service_id,
        models.Service.stylist_id == user.stylist_profile.id,
    ).first()
    if not service:
        raise HTTPException(404, "Service not found")
    for k, v in req.model_dump(exclude_none=True).items():
        setattr(service, k, v)
    db.commit()
    db.refresh(service)
    return service


@app.delete("/services/{service_id}")
def delete_service(
    service_id: str,
    user: models.User = Depends(auth.require_stylist),
    db: Session = Depends(get_db),
):
    service = db.query(models.Service).filter(
        models.Service.id == service_id,
        models.Service.stylist_id == user.stylist_profile.id,
    ).first()
    if not service:
        raise HTTPException(404, "Service not found")
    db.delete(service)
    db.commit()
    return {"ok": True}


# ── Stylist own profile ───────────────────────────────────────────────────────

@app.get("/stylist/me/profile")
def get_own_profile(user: models.User = Depends(auth.require_stylist)):
    return {
        "name": user.name,
        "email": user.email,
        "slug": user.stylist_profile.slug,
        "bio": user.stylist_profile.bio,
        "location": user.stylist_profile.location,
        "instagram": user.stylist_profile.instagram,
    }


@app.put("/stylist/me/profile")
def update_own_profile(
    req: schemas.ProfileUpdate,
    user: models.User = Depends(auth.require_stylist),
    db: Session = Depends(get_db),
):
    for k, v in req.model_dump(exclude_none=True).items():
        setattr(user.stylist_profile, k, v)
    db.commit()
    return {"ok": True}


# ── Intake ────────────────────────────────────────────────────────────────────

@app.post("/intake/{slug}/start", response_model=schemas.StartIntakeResponse)
def start_intake(slug: str, req: schemas.StartIntakeRequest, db: Session = Depends(get_db)):
    profile = db.query(models.StylistProfile).filter(
        models.StylistProfile.slug == slug
    ).first()
    if not profile:
        raise HTTPException(404, "Stylist not found")

    service = db.query(models.Service).filter(
        models.Service.id == req.service_id,
        models.Service.stylist_id == profile.id,
    ).first()
    if not service:
        raise HTTPException(404, "Service not found")

    session = models.IntakeSession(
        id=str(uuid.uuid4()),
        token=str(uuid.uuid4()),
        stylist_id=profile.id,
        service_id=service.id,
        client_name=req.client_name,
        client_email=req.client_email,
        appointment_at=req.appointment_at,
        status="pending",
    )
    db.add(session)
    db.commit()

    return schemas.StartIntakeResponse(
        token=session.token,
        service=schemas.ServiceOut.model_validate(service),
        stylist_name=profile.user.name,
    )


@app.get("/intake/{token}")
def get_intake_session(token: str, db: Session = Depends(get_db)):
    session = db.query(models.IntakeSession).filter(
        models.IntakeSession.token == token
    ).first()
    if not session:
        raise HTTPException(404, "Intake session not found")
    return {
        "token": session.token,
        "client_name": session.client_name,
        "service": schemas.ServiceOut.model_validate(session.service) if session.service else None,
        "stylist_name": session.stylist.user.name,
        "stylist_slug": session.stylist.slug,
        "status": session.status,
        "submitted": session.hair_profile is not None,
    }


@app.post("/intake/{token}/submit", response_model=schemas.IntakeSubmitResponse)
def submit_intake(
    token: str,
    req: schemas.HairProfileSubmit,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    session = db.query(models.IntakeSession).filter(
        models.IntakeSession.token == token
    ).first()
    if not session:
        raise HTTPException(404, "Intake session not found")
    if session.hair_profile:
        raise HTTPException(400, "This intake has already been submitted")

    hair = models.HairProfile(
        id=str(uuid.uuid4()),
        session_id=session.id,
        **req.model_dump(),
    )
    db.add(hair)
    db.flush()

    service = session.service
    est_hours, prep_mins, price_min, price_max, score = estimate_complexity(service, hair)

    estimate = models.ComplexityEstimate(
        id=str(uuid.uuid4()),
        session_id=session.id,
        estimated_service_hours=est_hours,
        prep_time_minutes=prep_mins,
        suggested_price_min=price_min,
        suggested_price_max=price_max,
        complexity_score=score,
    )
    db.add(estimate)
    db.commit()

    stylist_user = session.stylist.user
    payload = email_templates.new_intake_for_stylist(
        stylist_name=stylist_user.name,
        client_name=session.client_name or "A client",
        token=session.token,
        estimated_hours=est_hours,
        complexity_score=score,
    )
    background_tasks.add_task(
        email_service.send_email,
        stylist_user.email, payload["subject"], payload["html"], payload["text"],
    )

    return schemas.IntakeSubmitResponse(
        message="Intake submitted successfully",
        client_name=session.client_name,
        service_name=service.name,
        stylist_name=session.stylist.user.name,
        estimate=schemas.EstimateOut(
            estimated_service_hours=est_hours,
            prep_time_minutes=prep_mins,
            suggested_price_min=price_min,
            suggested_price_max=price_max,
            complexity_score=score,
        ),
    )


# ── Dashboard ─────────────────────────────────────────────────────────────────

@app.get("/dashboard/intakes")
def list_intakes(
    user: models.User = Depends(auth.require_stylist),
    db: Session = Depends(get_db),
):
    sessions = (
        db.query(models.IntakeSession)
        .filter(models.IntakeSession.stylist_id == user.stylist_profile.id)
        .order_by(models.IntakeSession.created_at.desc())
        .all()
    )
    return [
        {
            "token": s.token,
            "client_name": s.client_name,
            "client_email": s.client_email,
            "service_name": s.service.name if s.service else None,
            "status": s.status,
            "submitted": s.hair_profile is not None,
            "stylist_note": s.stylist_note,
            "adjusted_price_min": s.adjusted_price_min,
            "adjusted_price_max": s.adjusted_price_max,
            "appointment_at": s.appointment_at.isoformat() if s.appointment_at else None,
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "estimate": {
                "estimated_service_hours": s.estimate.estimated_service_hours,
                "prep_time_minutes": s.estimate.prep_time_minutes,
                "suggested_price_min": s.estimate.suggested_price_min,
                "suggested_price_max": s.estimate.suggested_price_max,
                "complexity_score": s.estimate.complexity_score,
            } if s.estimate else None,
        }
        for s in sessions
    ]


@app.patch("/dashboard/intakes/{token}/decision")
def update_intake_decision(
    token: str,
    req: schemas.DecisionRequest,
    background_tasks: BackgroundTasks,
    user: models.User = Depends(auth.require_stylist),
    db: Session = Depends(get_db),
):
    session = db.query(models.IntakeSession).filter(
        models.IntakeSession.token == token,
        models.IntakeSession.stylist_id == user.stylist_profile.id,
    ).first()
    if not session:
        raise HTTPException(404, "Intake not found")

    session.status = req.status
    if req.stylist_note is not None:
        session.stylist_note = req.stylist_note
    if req.adjusted_price_min is not None:
        session.adjusted_price_min = req.adjusted_price_min
    if req.adjusted_price_max is not None:
        session.adjusted_price_max = req.adjusted_price_max

    db.commit()

    price_min = session.adjusted_price_min or (session.estimate.suggested_price_min if session.estimate else None)
    price_max = session.adjusted_price_max or (session.estimate.suggested_price_max if session.estimate else None)
    payload = email_templates.decision_for_client(
        client_name=session.client_name or "there",
        stylist_name=user.name,
        status=session.status,
        price_min=price_min,
        price_max=price_max,
        stylist_note=session.stylist_note,
    )
    background_tasks.add_task(
        email_service.send_email,
        session.client_email, payload["subject"], payload["html"], payload["text"],
    )

    return {"ok": True, "status": session.status}


@app.get("/dashboard/intakes/{token}")
def get_intake_detail(
    token: str,
    user: models.User = Depends(auth.require_stylist),
    db: Session = Depends(get_db),
):
    session = db.query(models.IntakeSession).filter(
        models.IntakeSession.token == token,
        models.IntakeSession.stylist_id == user.stylist_profile.id,
    ).first()
    if not session:
        raise HTTPException(404, "Intake not found")

    hair = session.hair_profile
    est = session.estimate

    return {
        "token": session.token,
        "client_name": session.client_name,
        "client_email": session.client_email,
        "service": schemas.ServiceOut.model_validate(session.service) if session.service else None,
        "status": session.status,
        "stylist_note": session.stylist_note,
        "adjusted_price_min": session.adjusted_price_min,
        "adjusted_price_max": session.adjusted_price_max,
        "appointment_at": session.appointment_at.isoformat() if session.appointment_at else None,
        "created_at": session.created_at.isoformat() if session.created_at else None,
        "hair_profile": {
            "length": hair.length,
            "density": hair.density,
            "porosity": hair.porosity,
            "thickness": hair.thickness,
            "condition": hair.condition,
            "last_relaxer": hair.last_relaxer,
            "last_color": hair.last_color,
            "last_heat": hair.last_heat,
            "has_breakage": hair.has_breakage,
            "is_washed": hair.is_washed,
            "is_detangled": hair.is_detangled,
            "is_product_free": hair.is_product_free,
            "style_inspiration": hair.style_inspiration,
            "preferred_duration_hours": hair.preferred_duration_hours,
            "scalp_issues": hair.scalp_issues,
        } if hair else None,
        "estimate": {
            "estimated_service_hours": est.estimated_service_hours,
            "prep_time_minutes": est.prep_time_minutes,
            "suggested_price_min": est.suggested_price_min,
            "suggested_price_max": est.suggested_price_max,
            "complexity_score": est.complexity_score,
        } if est else None,
    }
