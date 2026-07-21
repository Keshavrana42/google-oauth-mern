# Google OAuth Authentication (MERN + Passport.js Sessions)

A full MERN application that lets users log in with their Google account via **Passport.js**, using
**server-side sessions** (no JWT) stored in MongoDB.

## Features

- "Continue with Google" login on the Login page
- First-time login creates a user in MongoDB; returning users are matched by `googleId` (no duplicates)
- Stores Name, Email, Google ID, Profile Picture, join date, and last login time
- Session persists across page refreshes (session store backed by MongoDB via `connect-mongo`)
- Protected Dashboard route — unauthenticated users are redirected to `/login`
- Logout button that destroys the session and redirects to Login
- Loading indicators, "Logged in with Google" badge, responsive UI
- Graceful handling of failed/cancelled Google login

## Project Structure

google-oauth-app/
├── backend/
│ ├── config/passport.js # Google strategy, serialize/deserialize
│ ├── middleware/auth.js # ensureAuthenticated guard
│ ├── models/user.js # Mongoose User schema
│ ├── routes/auth.js # /api/auth/* routes
│ └── server.js # Express app entry point
└── frontend/
└── src/
├── api/axios.js
├── context/AuthContext.jsx
├── components/ (ProtectedRoute, Loader)
├── pages/ (Login, Dashboard)
├── App.jsx
└── main.jsx



## Setup

### 1. Google OAuth Credentials
Create OAuth 2.0 credentials at [Google Cloud Console](https://console.cloud.google.com/), with redirect URI: 
http://localhost:5000/api/auth/google/callback


### 2. Backend
```bash
cd backend
npm install
```
Create a `.env` file with:
PORT=5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=some_long_random_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:5173


Run:
```bash
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
```
Create a `.env` file with:

VITE_API_URL=http://localhost:5000


Run:
```bash
npm run dev
```

Visit `http://localhost:5173`.

## How Sessions Work (No JWT)

Passport stores only the MongoDB `_id` in the session via `serializeUser`. `express-session` persists that
session server-side in MongoDB (`connect-mongo`), sending the browser an `httpOnly` cookie. On each request,
`deserializeUser` looks up the full user and attaches it to `req.user`. The frontend checks
`GET /api/auth/current_user` on load to restore login state after a refresh.