# JS.hub

A full-stack JavaScript learning platform — topics, challenges, and a live playground.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Styling | CSS Modules |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Deploy (FE) | Vercel |
| Deploy (BE) | Render |

## Project Structure

```
jshub/
├── frontend/           # React + Vite app
│   ├── src/
│   │   ├── components/ # Navbar, PageLoader, ErrorBoundary
│   │   ├── context/    # ProgressContext (optimistic progress state)
│   │   ├── hooks/      # useTopics, useTopic, useChallenges, useSandbox
│   │   ├── lib/        # api.js (fetch wrapper), sandbox.js (iframe runner)
│   │   ├── pages/      # Home, Topics, TopicDetail, Challenges, Playground
│   │   └── App.jsx
│   ├── vite.config.js
│   └── package.json
│
└── backend/            # Express API
    ├── data/           # content.js — single source of truth for topics + challenges
    ├── lib/            # db.js (Mongoose connection)
    ├── models/         # Progress.js
    ├── routes/
    │   ├── topics.js
    │   ├── challenges.js
    │   └── progress.js
    ├── server.js
    └── package.json
```

## Local Development

### 1. Clone and install

```bash
# Frontend
cd frontend
npm install
npm run dev        # runs on http://localhost:5173

# Backend (new terminal)
cd backend
npm install
npm run dev        # runs on http://localhost:3001
```

### 2. Configure the backend

Create `backend/.env`:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/jshub
FRONTEND_URL=http://localhost:5173
PORT=3001
```

The Vite dev server proxies `/api` → `http://localhost:3001` automatically.

---

## Deploy to Vercel + Render

### Backend → Render

1. Push repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your repo, point to `backend/` directory
4. Settings:
   - **Build command**: `npm install`
   - **Start command**: `npm start`
   - **Environment**: Node
5. Add environment variables:
   ```
   MONGODB_URI=mongodb+srv://...
   FRONTEND_URL=https://your-app.vercel.app
   ```
6. Deploy → copy your Render URL (e.g. `https://jshub-api.onrender.com`)

> ⚠️ **Render free tier spins down after 15 min of inactivity.**
> Hit `GET /health` 5 minutes before any demo to wake it up.

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → import repo
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   ```
   VITE_API_URL=https://jshub-api.onrender.com
   ```
4. Deploy — Vercel auto-detects Vite, no extra config needed.

---

## API Endpoints

```
GET    /health                                   — health check
GET    /api/topics                               — all topics (optional ?level=beginner)
GET    /api/topics/:slug                         — single topic with full content
GET    /api/challenges                           — all challenges (optional ?level=intermediate)
GET    /api/challenges/:id                       — single challenge with starter code + solution
GET    /api/progress/:userId                     — get user progress
POST   /api/progress/:userId/topic/:slug         — mark topic complete
DELETE /api/progress/:userId/topic/:slug         — unmark topic
POST   /api/progress/:userId/challenge/:id       — mark challenge complete
DELETE /api/progress/:userId/challenge/:id       — unmark challenge
```

---

## Extending the App

### Add more topics or challenges

Edit `backend/data/content.js` — add entries to the `topics` or `challenges` arrays following the existing shape.

### Add authentication

```bash
cd backend
npm install jsonwebtoken bcrypt
```

Add a `routes/auth.js` with register/login endpoints and JWT middleware. Replace the random `localStorage` userId in `ProgressContext` with a decoded JWT claim.
