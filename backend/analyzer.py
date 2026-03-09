"""
analyzer.py — Hair type analyzer.

MVP: Weighted random pick from the four hair type categories.
     Image is saved but not truly processed.

To plug in a real TensorFlow model later:
  1. Load the model at module level: model = tf.keras.models.load_model("model.h5")
  2. Replace the body of `analyze_image` with real preprocessing + model.predict()
  3. Keep the return shape identical so no other file needs changing.
"""

import random
from pathlib import Path

# ── Hair type definitions ────────────────────────────────────────────────────

HAIR_TYPES = {
    "1A": {
        "label": "Type 1A — Straight & Fine",
        "category": "straight",
        "characteristics": ["very fine", "pin-straight", "no natural wave or curl"],
        "weight": 0.15,
    },
    "1B": {
        "label": "Type 1B — Straight & Medium",
        "category": "straight",
        "characteristics": ["medium thickness", "slight volume at roots", "pin-straight"],
        "weight": 0.10,
    },
    "2A": {
        "label": "Type 2A — Wavy & Fine",
        "category": "wavy",
        "characteristics": ["loose S-waves", "fine texture", "low-to-medium volume"],
        "weight": 0.15,
    },
    "2B": {
        "label": "Type 2B — Wavy & Medium",
        "category": "wavy",
        "characteristics": ["defined S-waves", "medium texture", "prone to frizz"],
        "weight": 0.10,
    },
    "3A": {
        "label": "Type 3A — Curly & Loose",
        "category": "curly",
        "characteristics": ["large loose curls", "springy", "naturally moisturized"],
        "weight": 0.15,
    },
    "3B": {
        "label": "Type 3B — Curly & Medium",
        "category": "curly",
        "characteristics": ["medium ringlets", "lots of volume", "needs moisture"],
        "weight": 0.10,
    },
    "3C": {
        "label": "Type 3C — Curly & Tight",
        "category": "curly",
        "characteristics": ["tight corkscrew curls", "dense", "high shrinkage"],
        "weight": 0.10,
    },
    "4A": {
        "label": "Type 4A — Coily",
        "category": "coily",
        "characteristics": ["tightly coiled S-pattern", "highly porous", "needs regular moisture"],
        "weight": 0.07,
    },
    "4B": {
        "label": "Type 4B — Coily & Zigzag",
        "category": "coily",
        "characteristics": ["Z-shaped pattern", "very dense", "high shrinkage"],
        "weight": 0.05,
    },
    "4C": {
        "label": "Type 4C — Coily & Tight",
        "category": "coily",
        "characteristics": ["very tight coils", "most fragile", "up to 75% shrinkage"],
        "weight": 0.03,
    },
}


def analyze_image(image_path: Path) -> dict:
    """
    Accepts a saved image path, returns hair analysis dict.
    MVP: weighted random selection.
    Replace internals with model.predict() when real model is ready.
    """
    # MVP: image is saved but not processed. Swap in tf.keras model here later.
    types = list(HAIR_TYPES.keys())
    weights = [HAIR_TYPES[t]["weight"] for t in types]
    chosen_key = random.choices(types, weights=weights, k=1)[0]
    chosen = HAIR_TYPES[chosen_key]

    confidence = round(random.uniform(0.72, 0.96), 2)
    # Pick 2 runner-up types (excluding chosen) for a richer response
    remaining = [t for t in types if t != chosen_key]
    runner_up_keys = random.sample(remaining, 2)

    return {
        "hair_type": chosen_key,
        "hair_type_label": chosen["label"],
        "category": chosen["category"],
        "confidence": confidence,
        "characteristics": chosen["characteristics"],
        "runner_up": [
            {
                "hair_type": k,
                "label": HAIR_TYPES[k]["label"],
                "confidence": round(random.uniform(0.10, 0.30), 2),
            }
            for k in runner_up_keys
        ],
        "analyzer_version": "mock-1.0",  # Change to "tensorflow-2.x" when real model is live
    }
