# Habit Tracker

A production-ready full-stack habit tracker built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, Mongoose, JWT auth, bcrypt, and Chart.js.

## Features

- JWT signup/login with bcrypt password hashing
- Protected API routes and protected frontend routes
- Create, edit, delete habits
- Daily and weekly habits with per-day completion history
- Duplicate completion prevention per day
- Streak counts, weekly progress chart, completion percentage
- Weekly goals and motivation labels
- Basic reminder settings plus browser notification prompts
- Mobile-first responsive UI:
  - Mobile: single-column layout and bottom navigation
  - Tablet: balanced two-column grids
  - Desktop: sidebar and multi-column dashboard
- Dark mode toggle

## Project Structure

```text
Habit Tracker/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
  frontend/
    src/
      api/
      components/
      context/
      pages/
      utils/
```

## Run Locally

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Create backend environment file:

```bash
cp .env.example .env
```

Set `MONGO_URI` and `JWT_SECRET` in `backend/.env`.

If you do not already have MongoDB running locally, start it with Docker:

```bash
docker compose up -d mongo
```

3. Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

4. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

5. Create frontend environment file:

```bash
cp .env.example .env
```

6. Start the frontend:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

## API Endpoints

### Auth

- `POST /api/auth/signup` - create an account
- `POST /api/auth/login` - login
- `GET /api/auth/me` - current user

### Habits

All habit endpoints require `Authorization: Bearer <token>`.

- `GET /api/habits` - list current user's habits with stats
- `POST /api/habits` - create habit
- `GET /api/habits/:id` - get one habit
- `PUT /api/habits/:id` - update habit
- `DELETE /api/habits/:id` - delete habit
- `POST /api/habits/:id/complete` - mark complete for a date
- `DELETE /api/habits/:id/complete` - remove completion for a date

## Database Schema

### User

- `name`
- `email`
- `password` hashed with bcrypt
- timestamps

### Habit

- `user` owner reference
- `name`
- `description`
- `frequency`: `daily` or `weekly`
- `weeklyGoal`
- `reminder`: enabled, time, days
- `completions`: completion dates
- timestamps
