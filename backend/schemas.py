from pydantic import BaseModel
from typing import Optional, List


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str               # "stylist" | "client"
    slug: Optional[str] = None      # required when role == "stylist"
    location: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    role: str
    slug: Optional[str] = None


# ── Services ──────────────────────────────────────────────────────────────────

class ServiceCreate(BaseModel):
    name: str
    base_price: float
    base_time_hours: float
    description: Optional[str] = None


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    base_price: Optional[float] = None
    base_time_hours: Optional[float] = None
    description: Optional[str] = None


class ServiceOut(BaseModel):
    id: str
    name: str
    base_price: float
    base_time_hours: float
    description: Optional[str] = None

    model_config = {"from_attributes": True}


# ── Stylist public profile ────────────────────────────────────────────────────

class StylistPublicProfile(BaseModel):
    name: str
    slug: str
    bio: Optional[str] = None
    location: Optional[str] = None
    services: List[ServiceOut]


# ── Intake ────────────────────────────────────────────────────────────────────

class StartIntakeRequest(BaseModel):
    client_name: str
    client_email: str
    service_id: str


class StartIntakeResponse(BaseModel):
    token: str
    service: ServiceOut
    stylist_name: str


class HairProfileSubmit(BaseModel):
    # Hair details
    length: str
    density: str
    porosity: str
    thickness: str
    condition: str
    # Hair history
    last_relaxer: str
    last_color: str
    last_heat: str
    has_breakage: bool
    # Preparation
    is_washed: bool
    is_detangled: bool
    is_product_free: bool
    # Goals
    style_inspiration: Optional[str] = None
    preferred_duration_hours: Optional[float] = None
    scalp_issues: Optional[str] = None


class EstimateOut(BaseModel):
    estimated_service_hours: float
    prep_time_minutes: int
    suggested_price_min: float
    suggested_price_max: float
    complexity_score: float


class IntakeSubmitResponse(BaseModel):
    message: str
    client_name: str
    service_name: str
    stylist_name: str
    estimate: EstimateOut


# ── Decision ──────────────────────────────────────────────────────────────────

class DecisionRequest(BaseModel):
    status: str  # confirmed | rescheduled | prep_requested | reviewed
    stylist_note: Optional[str] = None
    adjusted_price_min: Optional[float] = None
    adjusted_price_max: Optional[float] = None


# ── Profile management ────────────────────────────────────────────────────────

class ProfileUpdate(BaseModel):
    bio: Optional[str] = None
    location: Optional[str] = None
    instagram: Optional[str] = None
