"""
Unit tests for estimator.estimate_complexity.

The estimator is a pure function over two attribute-bearing objects (a Service
and a HairProfile), so we use lightweight fakes instead of touching the DB.
"""
from types import SimpleNamespace

import pytest

from estimator import estimate_complexity


def make_service(base_price=100.0, base_time_hours=2.0):
    return SimpleNamespace(base_price=base_price, base_time_hours=base_time_hours)


def make_hair(**overrides):
    defaults = dict(
        length="shoulder",
        density="medium",
        porosity="medium",
        thickness="medium",
        condition="healthy",
        last_relaxer="never",
        last_color="never",
        last_heat="rarely",
        has_breakage=False,
        is_washed=True,
        is_detangled=True,
        is_product_free=True,
    )
    defaults.update(overrides)
    return SimpleNamespace(**defaults)


# ── Baseline ──────────────────────────────────────────────────────────────────

def test_baseline_returns_base_hours_and_zero_prep():
    """Shoulder-length, medium-everything, healthy, fully prepped → no extras."""
    est_hours, prep, p_min, p_max, score = estimate_complexity(make_service(), make_hair())
    assert est_hours == 2.0
    assert prep == 0
    assert p_min <= p_max
    assert 0 <= score <= 10


# ── Length multiplier ─────────────────────────────────────────────────────────

@pytest.mark.parametrize("length,expected_hours", [
    ("twa", 1.5),         # 2.0 * 0.7 = 1.4 → rounds to 1.5
    ("shoulder", 2.0),    # 2.0 * 1.0
    ("waist_plus", 3.0),  # 2.0 * 1.6 = 3.2 → rounds to 3.0 (nearest 0.5)
])
def test_length_multiplier_drives_estimated_hours(length, expected_hours):
    est_hours, *_ = estimate_complexity(make_service(), make_hair(length=length))
    assert est_hours == expected_hours


# ── Prep penalties ────────────────────────────────────────────────────────────

@pytest.mark.parametrize("flags,expected_prep", [
    ({"is_washed": False}, 20),
    ({"is_detangled": False}, 30),
    ({"is_product_free": False}, 10),
    ({"is_washed": False, "is_detangled": False, "is_product_free": False}, 60),
])
def test_prep_minutes_accumulate(flags, expected_prep):
    _, prep, *_ = estimate_complexity(make_service(), make_hair(**flags))
    assert prep == expected_prep


# ── Extra-hours factors ───────────────────────────────────────────────────────

# Note: factors that add <0.5 hours can be absorbed by the round-to-half-hour
# step on `estimated_hours`. They still show up in complexity_score and price,
# so we assert on score where the signal is preserved.

def test_low_porosity_raises_complexity_score():
    *_, base = estimate_complexity(make_service(), make_hair(porosity="medium"))
    *_, low = estimate_complexity(make_service(), make_hair(porosity="low"))
    assert low > base


def test_recent_relaxer_raises_complexity_score():
    *_, base = estimate_complexity(make_service(), make_hair(last_relaxer="never"))
    *_, recent = estimate_complexity(make_service(), make_hair(last_relaxer="lt_6mo"))
    assert recent > base


def test_recent_color_raises_complexity_score():
    *_, base = estimate_complexity(make_service(), make_hair(last_color="never"))
    *_, recent = estimate_complexity(make_service(), make_hair(last_color="lt_3mo"))
    assert recent > base


def test_has_breakage_raises_complexity_score():
    *_, base = estimate_complexity(make_service(), make_hair(has_breakage=False))
    *_, broken = estimate_complexity(make_service(), make_hair(has_breakage=True))
    assert broken > base


# ── Pricing ───────────────────────────────────────────────────────────────────

def test_price_range_min_le_max():
    _, _, p_min, p_max, _ = estimate_complexity(make_service(), make_hair())
    assert p_min <= p_max


def test_long_hair_increases_price():
    _, _, p_min_short, p_max_short, _ = estimate_complexity(make_service(), make_hair(length="ear"))
    _, _, p_min_long, p_max_long, _ = estimate_complexity(make_service(), make_hair(length="waist_plus"))
    assert p_max_long > p_max_short
    assert p_min_long > p_min_short


# ── Complexity score ──────────────────────────────────────────────────────────

def test_complexity_score_is_capped_at_10():
    """Worst-case input shouldn't exceed the 0–10 scale."""
    worst = make_hair(
        length="waist_plus",
        density="high",
        thickness="coarse",
        condition="damaged",
        porosity="low",
        last_relaxer="lt_6mo",
        last_color="lt_3mo",
        has_breakage=True,
        is_washed=False,
        is_detangled=False,
        is_product_free=False,
    )
    *_, score = estimate_complexity(make_service(), worst)
    assert score <= 10.0


def test_complexity_score_grows_monotonically_with_density():
    *_, low = estimate_complexity(make_service(), make_hair(density="low"))
    *_, med = estimate_complexity(make_service(), make_hair(density="medium"))
    *_, high = estimate_complexity(make_service(), make_hair(density="high"))
    assert low <= med <= high


# ── Defensive defaults ────────────────────────────────────────────────────────

def test_unknown_porosity_falls_back_to_default_multiplier():
    """The estimator should be lenient about unexpected enum values."""
    est_hours, *_ = estimate_complexity(make_service(), make_hair(porosity="unsure"))
    assert est_hours > 0
