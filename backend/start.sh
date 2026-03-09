#!/bin/bash
# hAIrly Backend — startup script
# Run this from the backend/ folder

echo "Starting hAIrly backend..."

# Install dependencies if not present
if ! python3 -c "import fastapi" 2>/dev/null; then
  echo "Installing dependencies..."
  python3 -m pip install -r requirements.txt
fi

# Start the server
python3 -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
