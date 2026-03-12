# 🌸 hAIrly

**hAIrly** is an AI-powered hair care companion that helps you understand your hair, build personalized routines, and track your journey — all in one place. Upload a photo, get an instant hair analysis, and unlock a custom care plan, style suggestions, and a learning library built around your specific texture.

---

## Features

**Hair Analysis**
Upload a photo of your hair and the AI will identify your hair type, texture characteristics, and moisture profile. Results feed directly into your care plan and style suggestions.

**Personalized Care Plan**
A structured 8-week plan with daily, weekly, and nightly steps tailored to your hair type. Each step is completable, has a tutorial link, and can be pinned as a reminder. Completing every step earns a bonus coin reward.

**Progress Tracking**
Log your hair journey with mood ratings, written notes, and a 5-star hair rating. Entries are saved per session and displayed chronologically. Every saved entry extends your streak and earns coins.

**Style Suggestions**
Get hairstyle recommendations matched to your occasion, available time, current mood, and local weather. Save your favourite looks to Bookmarks for quick access later.

**Learn**
An interactive library covering hair types (1–4), porosity, and density. Each section includes a care routine, common mistakes, clickable trusted resources, and video links. Visiting the Learn page each day earns coins.

**Streaks & Coins**
A gamification layer that keeps motivation high. Your streak updates automatically when you log an entry, visit Learn, or complete a task. Coins accumulate across all actions and are displayed on the streak card.

**Reminders**
Set custom reminders for any care step or routine directly from the Care Plan or Tracking pages.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Create React App) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| HTTP client | Axios |
| Backend | FastAPI (Python) — runs separately on `localhost:8000` |
| Persistence | localStorage (streak, coins, reminders) + backend database |

---

## Getting Started

### Prerequisites

- Node.js 18+
- The hAIrly FastAPI backend running on `http://localhost:8000`

### Install & run

```bash
# Clone the repo
git clone <your-repo-url>
cd hairly-frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The app opens at [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env` file in the project root if your backend runs on a different URL:

```
REACT_APP_API_URL=http://localhost:8000
```

### Available scripts

| Command | Description |
|---|---|
| `npm start` | Start dev server at localhost:3000 |
| `npm run build` | Build optimised production bundle |
| `npm test` | Run tests in watch mode |

---

## Project Structure

```
src/
├── api.js                        # Axios instance + all API calls
├── App.js                        # Root component + page routing
├── components/
│   ├── BookmarksPage.js          # Saved hairstyles overlay
│   ├── CarePlans.js              # 8-week care plan + task completion
│   ├── HairAnalysis.js           # Photo upload + AI analysis results
│   ├── Home.js                   # Dashboard / landing for logged-in users
│   ├── LandingPage.js            # Public marketing landing page
│   ├── Learn.js                  # Hair education library
│   ├── Login.js                  # Login form
│   ├── MoodSelector.js           # Mood picker used in journal
│   ├── Navigation.js             # Top nav bar
│   ├── ProgressTracking.js       # Journal, reminders, and history
│   ├── Signup.js                 # Sign-up form
│   ├── Streak.js                 # Streak + coin card (used on Home & Learn)
│   ├── StyleRecommendations.js   # Style recommendation UI
│   └── StyleSuggestionsPage.js   # Full style suggestions overlay
├── utils/
│   ├── moodConfig.js             # Mood emoji mapping
│   ├── fileUtils.js              # File helpers
│   └── streakUtils.js            # Streak + coin localStorage logic
└── index.js

public/
└── data/
    └── hair_types.json           # Hair type content (characteristics, routines, links)
```

---

## How the Streak & Coins Work

| Action | Coins | Streak |
|---|---|---|
| Visiting Learn (once per day) | +5 | ✅ |
| Saving a progress log entry | +10 | ✅ |
| Completing a care plan step | +15 | ✅ |
| Finishing all care plan tasks | +50 bonus | ✅ |

Streak count and coin total are stored in `localStorage` and visible on the streak card on both the Home and Learn pages.

---

## Screenshots

<!-- Replace the placeholder lines below with your actual images -->
<!-- Tip: drag images into your GitHub repo and paste the generated URLs here -->

### Landing Page
<!-- ![Landing page](screenshots/landing.png) -->

### Hair Analysis
<!-- ![Hair analysis](screenshots/analysis.png) -->

### Care Plan
<!-- ![Care plan](screenshots/care-plan.png) -->

### Progress Tracking
<!-- ![Progress tracking](screenshots/tracking.png) -->

### Style Suggestions
<!-- ![Style suggestions](screenshots/styles.png) -->

### Learn
<!-- ![Learn page](screenshots/learn.png) -->

### Streak & Coins
<!-- ![Streak card](screenshots/streak.png) -->

---

## License

MIT
