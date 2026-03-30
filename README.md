# Sports Calendar

A full-stack web application for displaying sports events. Built with Node.js, Express, PostgreSQL, and React.

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Frontend:** React (Vite)
- **Testing:** Jest, Supertest

## Project Structure

```
sports-calendar/
  backend/        # Express API
  frontend/       # React app
  db/             # SQL schema and seed data
```

## Setup

### Prerequisites

- Node.js
- PostgreSQL

### Database

Create the database:

```bash
psql -U postgres -c "CREATE DATABASE sports_calendar;"
```

Run the schema and seed data:

```bash
psql -U postgres -d sports_calendar -f db/schema.sql
psql -U postgres -d sports_calendar -f db/seed.sql
```

### Backend

Create a `.env` file inside `backend/`:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sports_calendar
DB_USER=postgres
DB_PASSWORD=
```

Then run:

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Endpoints

| Method | Endpoint        | Description      |
| ------ | --------------- | ---------------- |
| GET    | /api/events     | Get all events   |
| GET    | /api/events/:id | Get single event |
| POST   | /api/events     | Create new event |

## Running Tests

```bash
cd backend
npm test
```

## Database Design

Four tables: `sport`, `team`, `venue`, `event`. The `event` table references all three via foreign keys — two to `team` (home and away), one to `sport`, one to `venue`. Designed to third normal form.

## Decisions

- `event_datetime` stored as a single `TIMESTAMP` rather than separate date and time columns — simpler and more practical
- `_venue_id` is nullable — an event can be created before a venue is confirmed
- Frontend filters are handled client-side since the dataset is small — no need for extra API calls
- Tests cover both happy paths and error cases including validation and 404 handling
