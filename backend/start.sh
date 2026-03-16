#!/bin/bash
# hAIrly Backend v2 — startup script
# Run from the backend/ folder:  bash start.sh

echo "Starting hAIrly backend..."

# Create and use a virtual environment
if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  python3 -m venv venv
fi

source venv/bin/activate

# Install dependencies
pip install -r requirements.txt -q

# DATABASE_URL defaults to SQLite (hairly.db) if not set.
# To use PostgreSQL: export DATABASE_URL=postgresql://user:password@localhost/hairly

echo "Database: ${DATABASE_URL:-sqlite:///./hairly.db}"
echo "API docs will be at: http://127.0.0.1:8000/docs"

uvicorn main:app --reload --host 127.0.0.1 --port 8000
