# JS.hub

A full-stack JavaScript learning platform — topics, challenges, and a live playground.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Editor | CodeMirror 6 (one-dark) |
| Styling | CSS Modules |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT (Bearer) + bcrypt + email OTP |
| Email | Nodemailer (SMTP) / Resend |
| Deploy (FE) | Vercel |
| Deploy (BE) | Render |

## Features

- 9 topics across beginner → advanced with markdown content + runnable examples
- 6 challenges with starter code and solutions
- Live playground: sandboxed `<iframe>` with `console.log` interception, 10s timeout
- Email/password auth with OTP verification and password reset
- Per-user progress tracking (topics + challenges) with optimistic UI

## Project Structure

```
jshub/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── components/        # Navbar, PageLoader, ErrorBoundary
│   │   ├── context/           # AuthContext, ProgressContext
│   │   ├── hooks/             # useTopics, useTopic, useChallenges, useSandbox
│   │   ├── lib/               # api.js (fetch wrapper), sandbox.js (iframe runner)
│   │   ├── pages/             # Home, Topics, TopicDetail, Challenges, Playground,
│   │   │                      # Login, Register, ForgotPassword, ResetPassword,
│   │   │                      # VerifyEmail, NotFound
│   │   └── App.jsx
│   ├── vercel.json            # SPA rewrites
│   ├── vite.config.js
│   └── package.json
│
└── backend/                   # Express API
    ├── data/content.js        # single source of truth for topics + challenges
    ├── lib/
    │   ├── db.js              # Mongoose connection
    │   └── mailer.js          # SMTP transporter + email templates
    ├── middleware/
    │   └── requireAuth.js     # JWT Bearer verification
    ├── models/
    │   ├── User.js            # email, username, passwordHash, OTPs
    │   └── Progress.js        # userId, completedTopics, completedChallenges
    ├── routes/
    │   ├── auth.js            # register, verify, login, forgot, reset
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
npm run dev        # http://localhost:5173

# Backend (new terminal)
cd backend
npm install
npm run dev        # http://localhost:3001
```

### 2. Configure the backend

Create `backend/.env`:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/jshub
JWT_SECRET=<long-random-string>
FRONTEND_URL=http://localhost:5173
PORT=3001

# Email (for OTP verification + password reset)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=you@example.com
SMTP_PASS=<smtp-password>
EMAIL_FROM=JS.hub <you@example.com>

# Optional: skip OTP entirely (useful for local dev or prod without SMTP)
SKIP_EMAIL_VERIFICATION=false
```

### 3. Configure the frontend

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:3001
```

The Vite dev server also proxies `/api` → `http://localhost:3001` automatically.

---

## Deploy to Vercel + Render

### Backend → Render

1. Push repo to GitHub
2. [render.com](https://render.com) → New → Web Service
3. Connect repo, point to `backend/` directory
4. Settings:
   - **Build command**: `npm install`
   - **Start command**: `npm start`
   - **Environment**: Node
5. Add environment variables (see `backend/.env` above) — `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, SMTP credentials
6. Deploy → copy your Render URL (e.g. `https://jshub-api.onrender.com`)

> ⚠️ **Render free tier spins down after 15 min of inactivity.**
> The frontend pings `GET /health` on load and every 10 minutes to keep it warm.

> ℹ️ **SMTP on Render free tier:** outbound SMTP is often blocked. Either set `SKIP_EMAIL_VERIFICATION=true` or switch the mailer to the Resend HTTP API.

### Frontend → Vercel

1. [vercel.com](https://vercel.com) → New Project → import repo
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   ```
   VITE_API_URL=https://jshub-api.onrender.com
   ```
4. Deploy — Vercel auto-detects Vite. `vercel.json` handles SPA fallback.

---

## API Endpoints

All `/api/progress/*` endpoints require `Authorization: Bearer <token>`.

### Auth

```
POST   /api/auth/register             { email, username, password }
POST   /api/auth/verify-email         { email, otp }
POST   /api/auth/resend-verification  { email }
POST   /api/auth/login                { email, password }
POST   /api/auth/forgot-password      { email }
POST   /api/auth/reset-password       { email, otp, password }
```

### Content

```
GET    /api/topics                    # all topics (optional ?level=beginner)
GET    /api/topics/:slug              # single topic with full content
GET    /api/challenges                # all challenges (optional ?level=intermediate)
GET    /api/challenges/:id            # single challenge with starter + solution
```

### Progress (auth required)

```
GET    /api/progress                  # current user's progress
POST   /api/progress/topic/:slug      # mark topic complete
DELETE /api/progress/topic/:slug      # unmark topic
POST   /api/progress/challenge/:id    # mark challenge complete
DELETE /api/progress/challenge/:id    # unmark challenge
```

### Misc

```
GET    /health                        # health check (also used as Render keepalive)
```

---

## Extending the App

### Add more topics or challenges

Edit `backend/data/content.js` — add entries to the `topics` or `challenges` arrays following the existing shape. The frontend fetches everything via the API, so no frontend change is needed.

### Add a new playground snippet

Edit the `SNIPPETS` array in `frontend/src/pages/Playground.jsx`.
