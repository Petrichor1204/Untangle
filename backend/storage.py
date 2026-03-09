"""
storage.py — JSON-based persistence for sessions, logs, and bookmarks.
MVP implementation: flat JSON files. Swap in PostgreSQL/MongoDB later by
replacing load/save helpers and the public functions below.
"""

import json
import os
from datetime import datetime
from typing import Optional

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
SESSIONS_FILE = os.path.join(DATA_DIR, "sessions.json")
BOOKMARKS_FILE = os.path.join(DATA_DIR, "bookmarks.json")


# ── helpers ──────────────────────────────────────────────────────────────────

def _load(path: str) -> dict | list:
    try:
        with open(path, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {} if path == SESSIONS_FILE else []


def _save(path: str, data: dict | list) -> None:
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2, default=str)


# ── sessions ─────────────────────────────────────────────────────────────────

def create_session(session_id: str, hair_type: str, analysis: dict) -> dict:
    sessions = _load(SESSIONS_FILE)
    sessions[session_id] = {
        "session_id": session_id,
        "hair_type": hair_type,
        "analysis": analysis,
        "created_at": datetime.utcnow().isoformat(),
        "logs": [],
    }
    _save(SESSIONS_FILE, sessions)
    return sessions[session_id]


def get_session(session_id: str) -> Optional[dict]:
    sessions = _load(SESSIONS_FILE)
    return sessions.get(session_id)


# ── progress logs ─────────────────────────────────────────────────────────────

def add_log(session_id: str, notes: str, mood: str, rating: int) -> dict:
    sessions = _load(SESSIONS_FILE)
    if session_id not in sessions:
        sessions[session_id] = {
            "session_id": session_id,
            "hair_type": "unknown",
            "analysis": {},
            "created_at": datetime.utcnow().isoformat(),
            "logs": [],
        }
    entry = {
        "id": len(sessions[session_id]["logs"]) + 1,
        "notes": notes,
        "mood": mood,
        "rating": rating,
        "logged_at": datetime.utcnow().isoformat(),
    }
    sessions[session_id]["logs"].append(entry)
    _save(SESSIONS_FILE, sessions)
    return entry


def get_logs(session_id: str) -> list:
    sessions = _load(SESSIONS_FILE)
    session = sessions.get(session_id, {})
    return session.get("logs", [])


# ── bookmarks ─────────────────────────────────────────────────────────────────

def get_bookmarks(session_id: str) -> list:
    all_bookmarks = _load(BOOKMARKS_FILE)
    return [b for b in all_bookmarks if b.get("session_id") == session_id]


def add_bookmark(session_id: str, style: dict) -> dict:
    all_bookmarks = _load(BOOKMARKS_FILE)
    bookmark = {
        "session_id": session_id,
        "style_id": style.get("id"),
        "name": style.get("name"),
        "description": style.get("description"),
        "time_required": style.get("time_required"),
        "difficulty": style.get("difficulty"),
        "saved_at": datetime.utcnow().isoformat(),
    }
    all_bookmarks.append(bookmark)
    _save(BOOKMARKS_FILE, all_bookmarks)
    return bookmark


def remove_bookmark(session_id: str, style_id: str) -> bool:
    all_bookmarks = _load(BOOKMARKS_FILE)
    before = len(all_bookmarks)
    all_bookmarks = [
        b for b in all_bookmarks
        if not (b.get("session_id") == session_id and str(b.get("style_id")) == str(style_id))
    ]
    _save(BOOKMARKS_FILE, all_bookmarks)
    return len(all_bookmarks) < before
