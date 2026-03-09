# hAIrly Backend

FastAPI backend for the hAIrly hair care app.

## Setup

```bash
cd backend
pip install -r requirements.txt
```

## Run

```bash
uvicorn main:app --reload --port 8000
```

Or use the startup script:

```bash
bash start.sh
```

API docs available at: http://localhost:8000/docs

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/upload` | Upload hair photo, get analysis + session_id |
| GET | `/plan?session_id=` | Get care plan for your hair type |
| POST | `/log` | Save a progress journal entry |
| GET | `/history?session_id=` | Get all journal entries |
| POST | `/style-suggestions` | Get style suggestions by mood/occasion |
| GET | `/bookmarks?session_id=` | List saved style bookmarks |
| POST | `/bookmark-style` | Save a bookmark |
| DELETE | `/bookmark-style` | Remove a bookmark |

## Upgrading the ML model

The analyzer is in `analyzer.py`. To swap in a real TensorFlow model:

1. Train/download your model and save as `model.h5` in the `backend/` folder
2. In `analyzer.py`, replace the body of `analyze_image()`:
   ```python
   import tensorflow as tf
   model = tf.keras.models.load_model("model.h5")

   def analyze_image(image_path):
       img = preprocess(image_path)  # resize to model input size
       predictions = model.predict(img)
       # map predictions to hair type keys...
   ```
3. Change `"analyzer_version": "mock-1.0"` to `"tensorflow-2.x"`
4. No other files need to change — the return shape stays the same

## Upgrading storage

Data is stored in `data/sessions.json` and `data/bookmarks.json` for MVP.
To upgrade to a real database, replace the `_load` / `_save` helpers in `storage.py`
with SQLAlchemy (PostgreSQL) or Motor (MongoDB) calls. All public functions
(`create_session`, `add_log`, etc.) keep the same signatures.
