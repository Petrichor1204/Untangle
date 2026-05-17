import uuid
from sqlalchemy import Column, String, Integer, Boolean, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


def gen_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)  # stylist | client
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    stylist_profile = relationship("StylistProfile", back_populates="user", uselist=False)


class StylistProfile(Base):
    __tablename__ = "stylist_profiles"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    bio = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    instagram = Column(String, nullable=True)

    user = relationship("User", back_populates="stylist_profile")
    services = relationship("Service", back_populates="stylist", cascade="all, delete-orphan")
    intake_sessions = relationship("IntakeSession", back_populates="stylist")


class Service(Base):
    __tablename__ = "services"

    id = Column(String, primary_key=True, default=gen_uuid)
    stylist_id = Column(String, ForeignKey("stylist_profiles.id"), nullable=False)
    name = Column(String, nullable=False)
    base_price = Column(Float, nullable=False)
    base_time_hours = Column(Float, nullable=False)
    description = Column(Text, nullable=True)

    stylist = relationship("StylistProfile", back_populates="services")
    intake_sessions = relationship("IntakeSession", back_populates="service")


class IntakeSession(Base):
    __tablename__ = "intake_sessions"

    id = Column(String, primary_key=True, default=gen_uuid)
    token = Column(String, unique=True, nullable=False, index=True, default=gen_uuid)
    stylist_id = Column(String, ForeignKey("stylist_profiles.id"), nullable=False)
    service_id = Column(String, ForeignKey("services.id"), nullable=True)
    client_name = Column(String, nullable=True)
    client_email = Column(String, nullable=True)
    status = Column(String, default="pending")
    stylist_note = Column(Text, nullable=True)
    adjusted_price_min = Column(Float, nullable=True)
    adjusted_price_max = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    stylist = relationship("StylistProfile", back_populates="intake_sessions")
    service = relationship("Service", back_populates="intake_sessions")
    hair_profile = relationship("HairProfile", back_populates="session", uselist=False)
    estimate = relationship("ComplexityEstimate", back_populates="session", uselist=False)


class HairProfile(Base):
    __tablename__ = "hair_profiles"

    id = Column(String, primary_key=True, default=gen_uuid)
    session_id = Column(String, ForeignKey("intake_sessions.id"), unique=True, nullable=False)

    # Hair details
    length = Column(String)       # twa|ear|chin|shoulder|armpit|mid_back|waist_plus
    density = Column(String)      # low|medium|high
    porosity = Column(String)     # low|medium|high
    thickness = Column(String)    # fine|medium|coarse
    condition = Column(String)    # healthy|dry|damaged|transitioning

    # Hair history
    last_relaxer = Column(String)  # never|lt_6mo|6_12mo|gt_1yr
    last_color = Column(String)    # never|lt_3mo|3_6mo|gt_6mo
    last_heat = Column(String)     # this_week|this_month|this_year|rarely
    has_breakage = Column(Boolean, default=False)

    # Preparation
    is_washed = Column(Boolean, default=False)
    is_detangled = Column(Boolean, default=False)
    is_product_free = Column(Boolean, default=False)

    # Goals
    style_inspiration = Column(Text, nullable=True)
    preferred_duration_hours = Column(Float, nullable=True)
    scalp_issues = Column(Text, nullable=True)

    session = relationship("IntakeSession", back_populates="hair_profile")


class ComplexityEstimate(Base):
    __tablename__ = "complexity_estimates"

    id = Column(String, primary_key=True, default=gen_uuid)
    session_id = Column(String, ForeignKey("intake_sessions.id"), unique=True, nullable=False)
    estimated_service_hours = Column(Float, nullable=False)
    prep_time_minutes = Column(Integer, nullable=False)
    suggested_price_min = Column(Float, nullable=False)
    suggested_price_max = Column(Float, nullable=False)
    complexity_score = Column(Float, nullable=False)

    session = relationship("IntakeSession", back_populates="estimate")
