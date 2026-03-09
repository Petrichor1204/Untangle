"""
main.py — hAIrly FastAPI backend
Run with:  uvicorn main:app --reload --port 8000

All endpoints match the calls already made by the frontend's src/api.js
"""

import os
import uuid
import random
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from analyzer import analyze_image
from care_plans import get_plan_for_session
from storage import (
    create_session,
    get_session,
    add_log,
    get_logs,
    get_bookmarks,
    add_bookmark,
    remove_bookmark,
)

# ── App setup ────────────────────────────────────────────────────────────────

app = FastAPI(title="hAIrly API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOADS_DIR = Path(__file__).parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)


# ── Pydantic models ───────────────────────────────────────────────────────────

class LogRequest(BaseModel):
    session_id: str
    notes: str = ""
    mood: str = "neutral"
    rating: int = 3


class StyleRequest(BaseModel):
    session_id: str
    occasion: str = "everyday"
    time_available: str = "15 minutes"
    current_mood: str = "relaxed"


class BookmarkRequest(BaseModel):
    session_id: str
    style: dict


class BookmarkDeleteRequest(BaseModel):
    session_id: str
    style_id: str


# ── Style suggestion data ────────────────────────────────────────────────────

STYLE_LIBRARY = {
    "straight": [
        {"id": "s1", "name": "Sleek High Pony", "description": "A polished high ponytail with a smooth finish — effortlessly chic.", "time_required": "10 min", "difficulty": "easy", "occasions": ["work", "everyday", "date"]},
        {"id": "s2", "name": "Blowout Waves", "description": "Soft, bouncy waves created with a round brush blow-dry.", "time_required": "20 min", "difficulty": "medium", "occasions": ["date", "event", "everyday"]},
        {"id": "s3", "name": "Half-Up Twist", "description": "Top half twisted back and pinned — sweet and simple.", "time_required": "5 min", "difficulty": "easy", "occasions": ["everyday", "casual", "school"]},
        {"id": "s4", "name": "Straight & Glossy", "description": "Flat-ironed with a shine serum for mirror-like finish.", "time_required": "15 min", "difficulty": "easy", "occasions": ["work", "event", "date"]},
        {"id": "s5", "name": "French Tuck Braid", "description": "A loose French braid tucked and pinned at the nape.", "time_required": "10 min", "difficulty": "medium", "occasions": ["casual", "everyday", "event"]},
    ],
    "wavy": [
        {"id": "w1", "name": "Beach Wave Refresh", "description": "Scrunch in sea salt spray and diffuse for effortless beachy texture.", "time_required": "10 min", "difficulty": "easy", "occasions": ["casual", "everyday", "beach"]},
        {"id": "w2", "name": "Messy Bun", "description": "Gather waves into a loose, textured bun — perfectly undone.", "time_required": "3 min", "difficulty": "easy", "occasions": ["everyday", "casual", "quick"]},
        {"id": "w3", "name": "Twisted Half-Up", "description": "Twist the top sections back for a romantic, soft look.", "time_required": "8 min", "difficulty": "easy", "occasions": ["date", "event", "everyday"]},
        {"id": "w4", "name": "Diffused Wave Definition", "description": "Apply mousse and diffuse for maximum wave clumping and volume.", "time_required": "25 min", "difficulty": "medium", "occasions": ["event", "date", "work"]},
        {"id": "w5", "name": "Braided Crown", "description": "Two Dutch braids wrapped and pinned for a crown effect.", "time_required": "15 min", "difficulty": "medium", "occasions": ["event", "festival", "date"]},
    ],
    "curly": [
        {"id": "c1", "name": "Wash-and-Go", "description": "Define curls with cream and gel on soaking wet hair, then air-dry.", "time_required": "30 min (dry time)", "difficulty": "medium", "occasions": ["everyday", "casual", "work"]},
        {"id": "c2", "name": "Twist-Out", "description": "Two-strand twists overnight, unraveled in the morning for stretched curls.", "time_required": "20 min (+ overnight)", "difficulty": "medium", "occasions": ["work", "event", "everyday"]},
        {"id": "c3", "name": "Pineapple Updo", "description": "Gather curls to crown of head in a loose pineapple bun.", "time_required": "2 min", "difficulty": "easy", "occasions": ["quick", "casual", "everyday"]},
        {"id": "c4", "name": "Braid-Out", "description": "Cornrows or box braids unraveled for a stretched, defined pattern.", "time_required": "30 min (+ overnight)", "difficulty": "hard", "occasions": ["event", "date", "special"]},
        {"id": "c5", "name": "Defined Bantu Knots", "description": "Small coiled knots pinned close to scalp — bold and beautiful.", "time_required": "45 min", "difficulty": "hard", "occasions": ["event", "festival", "special"]},
    ],
    "coily": [
        {"id": "k1", "name": "Two-Strand Twist Style", "description": "Defined two-strand twists for a versatile, moisturized protective style.", "time_required": "60 min", "difficulty": "medium", "occasions": ["everyday", "work", "casual"]},
        {"id": "k2", "name": "Flat Twist Updo", "description": "Flat twists pinned up into an elegant updo with coil ends.", "time_required": "45 min", "difficulty": "hard", "occasions": ["event", "work", "date"]},
        {"id": "k3", "name": "Stretched Afro Puff", "description": "Banded, stretched afro puff for volume without shrinkage.", "time_required": "15 min", "difficulty": "easy", "occasions": ["everyday", "casual", "quick"]},
        {"id": "k4", "name": "Mini Braids", "description": "Small braids throughout for a long-lasting protective style.", "time_required": "120 min", "difficulty": "hard", "occasions": ["protective", "travel", "low-maintenance"]},
        {"id": "k5", "name": "Bantu Knot-Out", "description": "Bantu knots overnight, released for a defined coily pattern.", "time_required": "30 min (+ overnight)", "difficulty": "medium", "occasions": ["event", "date", "special"]},
    ],
}

# Mood → style characteristic mappings
MOOD_STYLE_MAP = {
    "relaxed": ["easy", "easy", "medium"],
    "energetic": ["medium", "hard", "medium"],
    "romantic": ["medium", "medium", "easy"],
    "professional": ["easy", "medium", "medium"],
    "creative": ["hard", "medium", "hard"],
    "tired": ["easy", "easy", "easy"],
}

WEATHER_CONDITIONS = ["sunny", "cloudy", "humid", "windy", "rainy", "dry"]


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "hAIrly API is running", "docs": "/docs"}


@app.post("/upload")
async def upload_hair_photo(file: UploadFile = File(...)):
    """
    Accept a hair photo, run the analyzer, create a session, return results.
    Frontend: HairAnalysis.js → uploadHairPhoto()
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    session_id = str(uuid.uuid4())
    ext = Path(file.filename).suffix if file.filename else ".jpg"
    save_path = UPLOADS_DIR / f"{session_id}{ext}"

    content = await file.read()
    with open(save_path, "wb") as f:
        f.write(content)

    analysis = analyze_image(save_path)
    session = create_session(session_id, analysis["hair_type"], analysis)

    return {
        "session_id": session_id,
        "analysis": analysis,
        "message": "Hair photo analyzed successfully.",
    }


@app.get("/plan")
def get_care_plan(session_id: str = Query(...)):
    """
    Return a full care plan for the session's detected hair type.
    Frontend: CarePlans.js → getCarePlan()
    """
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found. Please upload a hair photo first.")

    plan = get_plan_for_session(session)
    return plan


@app.post("/log")
def log_progress(body: LogRequest):
    """
    Save a progress journal entry for the session.
    Frontend: ProgressTracking.js → saveProgressLog()
    """
    entry = add_log(
        session_id=body.session_id,
        notes=body.notes,
        mood=body.mood,
        rating=max(1, min(5, body.rating)),
    )
    return {"success": True, "entry": entry}


@app.get("/history")
def get_history(session_id: str = Query(...)):
    """
    Return all progress log entries for the session.
    Frontend: ProgressTracking.js → getHistory()
    """
    logs = get_logs(session_id)
    return {
        "session_id": session_id,
        "total_entries": len(logs),
        "logs": logs,
    }


@app.post("/style-suggestions")
def get_style_suggestions(body: StyleRequest):
    """
    Return 3–5 style suggestions based on hair type, mood, occasion, and time.
    Frontend: StyleSuggestionsPage.js
    """
    session = get_session(body.session_id)
    category = "curly"  # default fallback
    if session:
        category = session.get("analysis", {}).get("category", "curly")

    styles = STYLE_LIBRARY.get(category, STYLE_LIBRARY["curly"])

    # Filter by time available (very basic)
    time_minutes = 60
    time_str = body.time_available.lower()
    for word in time_str.split():
        if word.isdigit():
            time_minutes = int(word)
            break

    # Filter and score
    preferred_difficulties = MOOD_STYLE_MAP.get(body.current_mood.lower(), ["easy", "medium", "medium"])

    def score(style):
        s = 0
        if style["difficulty"] in preferred_difficulties:
            s += 2
        if body.occasion.lower() in style.get("occasions", []):
            s += 3
        return s

    filtered = sorted(styles, key=score, reverse=True)[:5]

    weather = random.choice(WEATHER_CONDITIONS)

    return {
        "session_id": body.session_id,
        "suggestions": filtered,
        "weather": weather,
        "weather_tip": _weather_tip(weather, category),
        "occasion": body.occasion,
        "mood": body.current_mood,
    }


@app.get("/bookmarks")
def list_bookmarks(session_id: str = Query(...)):
    """
    Return all bookmarked styles for the session.
    Frontend: BookmarksPage.js
    """
    bookmarks = get_bookmarks(session_id)
    return {"session_id": session_id, "bookmarks": bookmarks}


@app.post("/bookmark-style")
def save_bookmark(body: BookmarkRequest):
    """
    Add a style to bookmarks.
    Frontend: StyleSuggestionsPage.js → bookmark toggle
    """
    bookmark = add_bookmark(body.session_id, body.style)
    return {"success": True, "bookmark": bookmark}


@app.delete("/bookmark-style")
def delete_bookmark(body: BookmarkDeleteRequest):
    """
    Remove a style from bookmarks.
    Frontend: StyleSuggestionsPage.js → bookmark toggle (remove)
    """
    removed = remove_bookmark(body.session_id, body.style_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Bookmark not found.")
    return {"success": True, "message": "Bookmark removed."}


# ── Helpers ──────────────────────────────────────────────────────────────────

def _weather_tip(weather: str, category: str) -> str:
    tips = {
        "humid": {
            "straight": "Humidity can cause frizz — use an anti-humidity spray today.",
            "wavy": "Humidity is your friend! Embrace the extra wave definition.",
            "curly": "Seal your curls with a strong hold gel to combat humidity frizz.",
            "coily": "Use extra sealing oil today to lock out humidity.",
        },
        "windy": {
            "straight": "Consider a sleek updo to avoid tangles in the wind.",
            "wavy": "A loose braid is perfect for windy days — pretty and tangle-free.",
            "curly": "Pin your curls up or try a puff to keep them defined in wind.",
            "coily": "A protective updo or bun is ideal for windy weather.",
        },
        "rainy": {
            "straight": "Rain can flatten straight hair — a high pony or bun is your best bet.",
            "wavy": "Rain will enhance your waves! Let them air-dry naturally.",
            "curly": "Embrace the moisture — apply extra gel and let rain enhance your curls.",
            "coily": "Protect coily hair from rain with a satin-lined hat or umbrella.",
        },
        "dry": {
            "straight": "Add extra shine serum today to combat static in dry air.",
            "wavy": "Spritz with a water/leave-in mix to keep waves hydrated.",
            "curly": "Use a heavier cream today — dry air steals moisture fast.",
            "coily": "Layer extra butter and oil today to combat dry air.",
        },
        "sunny": {
            "straight": "UV rays can fade color — use a UV-protectant spray if colored.",
            "wavy": "Sunny days are perfect for wash-and-air-dry — enjoy the natural texture.",
            "curly": "Sun can dry out curls — keep a spritz bottle handy for refreshing.",
            "coily": "Wear a hat or use UV-protecting products in direct sun.",
        },
        "cloudy": {
            "straight": "Great day for any style — no humidity or UV to worry about!",
            "wavy": "Ideal conditions for defined waves — go with your usual routine.",
            "curly": "Cloudy days are perfect for air-drying without heat.",
            "coily": "Great styling day — no extreme weather to work around.",
        },
    }
    return tips.get(weather, {}).get(category, "Check the forecast and adjust your routine accordingly.")
