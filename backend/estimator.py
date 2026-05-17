from typing import Tuple
import models

LENGTH_MULTIPLIER = {
    "twa": 0.7,
    "ear": 0.8,
    "chin": 0.9,
    "shoulder": 1.0,
    "armpit": 1.2,
    "mid_back": 1.4,
    "waist_plus": 1.6,
}

DENSITY_MULTIPLIER = {
    "low": 0.85,
    "medium": 1.0,
    "high": 1.3,
}

THICKNESS_MULTIPLIER = {
    "fine": 0.9,
    "medium": 1.0,
    "coarse": 1.2,
}

CONDITION_EXTRA_HOURS = {
    "healthy": 0.0,
    "dry": 0.5,
    "damaged": 1.0,
    "transitioning": 0.75,
}

# Low porosity = cuticle tightly closed; needs heat/steam to open — adds processing time
POROSITY_EXTRA_HOURS = {
    "low": 0.25,
    "medium": 0.0,
    "high": 0.0,
}

# Extra hours added when client has recent chemical history
RELAXER_EXTRA_HOURS = {
    "lt_6mo": 0.5,
    "6_12mo": 0.25,
    "gt_1yr": 0.0,
    "never": 0.0,
}

COLOR_EXTRA_HOURS = {
    "lt_3mo": 0.5,
    "3_6mo": 0.25,
    "gt_6mo": 0.0,
    "never": 0.0,
}


def estimate_complexity(
    service: models.Service,
    hair: models.HairProfile,
) -> Tuple[float, int, float, float, float]:
    """
    Returns (estimated_service_hours, prep_time_minutes, price_min, price_max, complexity_score).
    All logic is rule-based — no ML required.
    """
    base_time = service.base_time_hours
    base_price = service.base_price

    length_mult = LENGTH_MULTIPLIER.get(hair.length, 1.0)
    density_mult = DENSITY_MULTIPLIER.get(hair.density, 1.0)
    thickness_mult = THICKNESS_MULTIPLIER.get(hair.thickness, 1.0)
    condition_extra = CONDITION_EXTRA_HOURS.get(hair.condition, 0.0)
    porosity_extra = POROSITY_EXTRA_HOURS.get(hair.porosity, 0.0)
    relaxer_extra = RELAXER_EXTRA_HOURS.get(hair.last_relaxer, 0.0)
    color_extra = COLOR_EXTRA_HOURS.get(hair.last_color, 0.0)
    breakage_extra = 0.25 if hair.has_breakage else 0.0

    raw_hours = (
        (base_time * length_mult * density_mult * thickness_mult)
        + condition_extra
        + porosity_extra
        + relaxer_extra
        + color_extra
        + breakage_extra
    )
    # Round to nearest 0.5
    estimated_hours = round(raw_hours * 2) / 2

    # Prep time penalties
    prep_minutes = 0
    if not hair.is_washed:
        prep_minutes += 20
    if not hair.is_detangled:
        prep_minutes += 30
    if not hair.is_product_free:
        prep_minutes += 10

    # Price reflects all time-adding factors
    flat_extras = condition_extra + porosity_extra + relaxer_extra + color_extra + breakage_extra
    raw_price = (
        base_price * length_mult * density_mult * thickness_mult
        + (flat_extras * 20)
    )
    price_min = round(raw_price * 0.9)
    price_max = round(raw_price * 1.1)

    # Complexity score 0–10 (capped)
    raw_score = (
        (length_mult * 2.5)
        + (density_mult * 2.0)
        + (thickness_mult * 1.5)
        + (condition_extra * 1.5)
        + (porosity_extra * 2.0)
        + ((relaxer_extra + color_extra) * 1.0)
        + (breakage_extra * 2.0)
        + (prep_minutes / 30.0)
    )
    complexity_score = round(min(raw_score, 10.0), 1)

    return estimated_hours, prep_minutes, float(price_min), float(price_max), complexity_score
