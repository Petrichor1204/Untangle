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

CONDITION_EXTRA_HOURS = {
    "healthy": 0.0,
    "dry": 0.5,
    "damaged": 1.0,
    "transitioning": 0.75,
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
    condition_extra = CONDITION_EXTRA_HOURS.get(hair.condition, 0.0)

    raw_hours = (base_time * length_mult * density_mult) + condition_extra
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

    # Price
    raw_price = base_price * length_mult * density_mult + (condition_extra * 20)
    price_min = round(raw_price * 0.9)
    price_max = round(raw_price * 1.1)

    # Complexity score 0–10
    complexity_score = round(
        (length_mult * 3.0) + (density_mult * 3.0) + (condition_extra * 2.0) + (prep_minutes / 30.0),
        1,
    )

    return estimated_hours, prep_minutes, float(price_min), float(price_max), complexity_score
