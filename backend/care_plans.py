"""
care_plans.py — Hardcoded care plan data keyed by hair category.
Shape matches what CarePlans.js already expects from the /plan endpoint.
"""

from analyzer import HAIR_TYPES

CARE_PLANS = {
    "straight": {
        "overview": "Straight hair tends to get oily quickly as sebum travels down the shaft easily. Focus on lightweight products, gentle cleansing, and protecting natural shine.",
        "steps": [
            {
                "id": 1,
                "title": "Daily Cleanse & Condition",
                "icon": "droplets",
                "frequency": "Daily or every other day",
                "products": ["Lightweight sulfate-free shampoo", "Volumizing conditioner (roots only)", "Leave-in detangler"],
                "instructions": "Shampoo at roots to remove oil buildup. Apply conditioner mid-lengths to ends only to avoid weighing hair down. Rinse with cool water to seal the cuticle and boost shine.",
                "tip": "Avoid applying conditioner to your scalp — it adds weight and makes straight hair go flat faster.",
            },
            {
                "id": 2,
                "title": "Lightweight Conditioning Mask",
                "icon": "sparkles",
                "frequency": "Once a week",
                "products": ["Protein-free hydrating mask", "Argan oil (2–3 drops)"],
                "instructions": "After shampooing, apply a thin layer of mask from mid-shaft to ends. Leave on for 5–10 minutes, then rinse thoroughly. Follow with cool water rinse.",
                "tip": "Don't over-mask — once a week is plenty. Too much conditioning makes straight hair limp.",
            },
            {
                "id": 3,
                "title": "Heat Styling & Shine Boost",
                "icon": "zap",
                "frequency": "As needed",
                "products": ["Heat protectant spray", "Smoothing serum (pea-sized amount)", "Shine mist"],
                "instructions": "Always apply heat protectant before blow-drying or flat ironing. Use a round brush while blow-drying to add body. Finish with a tiny drop of serum on ends for frizz control and glass-like shine.",
                "tip": "Use the lowest effective heat setting. Straight hair shows heat damage (splits and breakage) quickly.",
            },
            {
                "id": 4,
                "title": "Overnight Protection",
                "icon": "moon",
                "frequency": "Nightly",
                "products": ["Silk or satin pillowcase", "Loose hair tie (optional)"],
                "instructions": "Sleep on a silk or satin pillowcase to reduce friction and keep hair smooth. If hair is long, loosely braid or tie it to prevent tangling. Avoid tight ponytails that cause breakage.",
                "tip": "A silk scrunchie at the nape (not the top) keeps straight hair tangle-free without leaving a crease.",
            },
        ],
        "products_to_avoid": ["Heavy butters", "Thick creams", "Castor oil (as a scalp oil)", "Sulfate-heavy shampoos"],
        "recommended_frequency": {
            "wash": "Every 1–2 days",
            "deep_condition": "Once a week",
            "trim": "Every 8–10 weeks",
        },
    },

    "wavy": {
        "overview": "Wavy hair sits between straight and curly — it benefits from light curl-enhancing products and methods that boost the S-wave without weighing it down.",
        "steps": [
            {
                "id": 1,
                "title": "Co-Wash or Low-Poo Cleanse",
                "icon": "droplets",
                "frequency": "Every 2–3 days",
                "products": ["Co-wash or sulfate-free low-poo shampoo", "Lightweight conditioner"],
                "instructions": "Use a co-wash or gentle low-poo shampoo to clean without stripping natural oils. Apply conditioner generously, detangle with fingers or wide-tooth comb, then rinse 80% out (leave a little for moisture).",
                "tip": "Over-washing is the #1 enemy of wavy hair — it removes oils that help waves form.",
            },
            {
                "id": 2,
                "title": "Wave-Enhancing Deep Condition",
                "icon": "sparkles",
                "frequency": "Once a week",
                "products": ["Moisture-rich deep conditioner", "Microfiber towel", "Shower cap"],
                "instructions": "Apply deep conditioner after washing. Cover with a shower cap and let sit 20–30 minutes (or use heat for deeper penetration). Rinse and gently scrunch out excess water with a microfiber towel.",
                "tip": "Scrunching in the shower while rinsing actually encourages wave formation — don't towel-dry roughly.",
            },
            {
                "id": 3,
                "title": "Styling for Wave Definition",
                "icon": "zap",
                "frequency": "Each wash day",
                "products": ["Light curl cream", "Lightweight gel or mousse", "Diffuser attachment"],
                "instructions": "On soaking wet hair, apply a small amount of curl cream then layer with mousse or gel. Scrunch upward. Diffuse on low heat, scrunching gently as you go. Once dry, scrunch out the 'cast' with your hands.",
                "tip": "Apply products to soaking wet hair only — wavy hair drops definition fast as it dries if products are applied too late.",
            },
            {
                "id": 4,
                "title": "Overnight Refresh & Protection",
                "icon": "moon",
                "frequency": "Nightly",
                "products": ["Silk pillowcase or bonnet", "Light water/conditioner spritz"],
                "instructions": "Pineapple your hair (high loose bun on top of head) before bed. Sleep on silk. In the morning, scrunch with a little water or leave-in to revive waves.",
                "tip": "The 'pineapple' method is the secret to second-day waves — it keeps volume and definition without flattening.",
            },
        ],
        "products_to_avoid": ["Heavy oils (coconut on low-porosity wavy hair)", "Thick shea butters", "Silicone-heavy serums", "Sulfate shampoos"],
        "recommended_frequency": {
            "wash": "Every 2–3 days",
            "deep_condition": "Weekly",
            "trim": "Every 10–12 weeks",
        },
    },

    "curly": {
        "overview": "Curly hair is naturally drier because oils from the scalp can't travel down the spiral shaft easily. Deep moisture, gentle handling, and curl-defining products are essential.",
        "steps": [
            {
                "id": 1,
                "title": "Gentle Cleanse & Detangle",
                "icon": "droplets",
                "frequency": "Every 3–5 days",
                "products": ["Sulfate-free clarifying shampoo (monthly)", "Co-wash (in between)", "Wide-tooth comb", "Slip conditioner"],
                "instructions": "Wet hair thoroughly. Apply co-wash or shampoo, massage scalp gently. While conditioner is in, detangle from ends to roots with a wide-tooth comb or fingers. Rinse with cool water.",
                "tip": "Always detangle with conditioner in — never dry. Start at the ends and work your way up to avoid breakage.",
            },
            {
                "id": 2,
                "title": "Weekly Deep Conditioning Ritual",
                "icon": "sparkles",
                "frequency": "Once a week",
                "products": ["Protein-moisture balanced deep conditioner", "Shower cap", "Warm towel or hooded dryer"],
                "instructions": "After co-washing, apply deep conditioner section by section. Cover with a shower cap. Apply warm towel over cap for 30 minutes (heat opens the cuticle for deeper penetration). Rinse with cool water.",
                "tip": "Alternate between a protein treatment and a moisture treatment each week to maintain the protein-moisture balance.",
            },
            {
                "id": 3,
                "title": "Curl Definition & Styling",
                "icon": "zap",
                "frequency": "Each wash day",
                "products": ["Leave-in conditioner", "Curl cream", "Gel (medium hold)", "Microfiber towel or T-shirt"],
                "instructions": "On soaking wet hair, apply leave-in conditioner, then curl cream, then gel (the LOC or LCO method). Scrunch upward to encourage curl clumping. Plop in a microfiber towel or T-shirt for 20 minutes. Air-dry or diffuse on low.",
                "tip": "The 'squish to condish' technique — squishing hair upward while rinsing — creates incredible curl definition.",
            },
            {
                "id": 4,
                "title": "Moisture-Lock Night Routine",
                "icon": "moon",
                "frequency": "Nightly",
                "products": ["Satin bonnet or silk pillowcase", "Light leave-in or curl refresher"],
                "instructions": "Apply a small amount of curl refresher or leave-in to rehydrate. Pineapple or twist hair loosely. Wear a satin bonnet to retain moisture overnight. In the morning, spritz with water and scrunch to revive.",
                "tip": "Curly hair thrives on moisture retention — a bonnet is non-negotiable for maintaining defined curls.",
            },
        ],
        "products_to_avoid": ["Sulfate shampoos (daily use)", "Silicones (without regular clarifying)", "Alcohol-heavy products", "Petrolatum or mineral oil"],
        "recommended_frequency": {
            "wash": "Every 3–5 days",
            "deep_condition": "Weekly",
            "trim": "Every 10–12 weeks",
        },
    },

    "coily": {
        "overview": "Coily hair is the most fragile and porous of all hair types. It thrives on rich moisture, gentle manipulation, and protective styling to retain length and prevent breakage.",
        "steps": [
            {
                "id": 1,
                "title": "Moisturizing Cleanse",
                "icon": "droplets",
                "frequency": "Once a week or every 10 days",
                "products": ["Moisturizing sulfate-free shampoo", "Detangling conditioner", "Finger detangling"],
                "instructions": "Divide hair into 4–6 sections. Apply shampoo to each section, gently massaging scalp with fingertips (not nails). Rinse in sections. Apply detangling conditioner and finger-detangle each section carefully before rinsing.",
                "tip": "Never shampoo coily hair without first detangling — tangling while cleansing causes significant breakage.",
            },
            {
                "id": 2,
                "title": "Intensive Deep Conditioning",
                "icon": "sparkles",
                "frequency": "Every wash day",
                "products": ["Butter-rich deep conditioner", "Shower cap", "Hooded dryer or heat cap"],
                "instructions": "Apply deep conditioner generously to each section. Cover with a plastic cap and sit under a hooded dryer for 30–45 minutes. Rinse with cool water. Follow with a cold-water rinse for extra moisture seal.",
                "tip": "Coily hair should deep condition every single wash day — it's not a weekly luxury, it's a necessity.",
            },
            {
                "id": 3,
                "title": "Protective Styling",
                "icon": "zap",
                "frequency": "After each wash",
                "products": ["Heavy leave-in conditioner", "Butter or cream styler", "Oil (sealing)"],
                "instructions": "Use the LCO method: Leave-in conditioner → Cream → Oil (seals moisture in). Style into twists, braids, or a wash-n-go while hair is still very wet. Allow to air-dry completely before manipulating.",
                "tip": "Sealing with an oil as the last step is critical for coily hair — it locks moisture in for days.",
            },
            {
                "id": 4,
                "title": "Nightly Protective Routine",
                "icon": "moon",
                "frequency": "Nightly",
                "products": ["Satin bonnet (full coverage)", "Satin-lined cap or pillowcase", "Light oil for ends"],
                "instructions": "Apply a small amount of oil to your ends before bed. Tuck hair into a full-coverage satin bonnet. Never sleep without protection — cotton pillowcases steal moisture from coily hair aggressively.",
                "tip": "Consider re-twisting or re-braiding your style before bed to stretch and preserve it while you sleep.",
            },
        ],
        "products_to_avoid": ["Sulfate shampoos", "Products with high alcohol content", "Silicone sealants (without clarifying)", "Combing dry coily hair"],
        "recommended_frequency": {
            "wash": "Once a week to every 10 days",
            "deep_condition": "Every wash day",
            "trim": "Every 12–16 weeks",
        },
    },
}


def get_plan_for_session(session: dict) -> dict:
    """Build the full care plan response for a session."""
    hair_type_key = session.get("hair_type", "3A")
    analysis = session.get("analysis", {})
    category = analysis.get("category", "curly")

    plan_data = CARE_PLANS.get(category, CARE_PLANS["curly"])
    hair_type_info = HAIR_TYPES.get(hair_type_key, {})

    return {
        "session_id": session["session_id"],
        "hair_type": hair_type_key,
        "hair_type_label": hair_type_info.get("label", hair_type_key),
        "category": category,
        "overview": plan_data["overview"],
        "steps": plan_data["steps"],
        "products_to_avoid": plan_data["products_to_avoid"],
        "recommended_frequency": plan_data["recommended_frequency"],
    }
