#!/bin/bash
# Untangle Backend v2 — startup script
# Run from the backend/ folder:  bash start.sh

echo "Starting Untangle backend..."

# Create and use a virtual environment
if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  python3 -m venv venv
fi

VENV_BIN="$(cd "$(dirname "$0")" && pwd)/venv/bin"

# Install dependencies
"$VENV_BIN/pip" install -r requirements.txt -q

# DATABASE_URL defaults to SQLite (untangle.db) if not set.
# To use PostgreSQL: export DATABASE_URL=postgresql://user:password@localhost/untangle

echo "Database: ${DATABASE_URL:-sqlite:///./untangle.db}"
echo "API docs will be at: http://127.0.0.1:8000/docs"

"$VENV_BIN/uvicorn" main:app --reload --host 127.0.0.1 --port 8000
