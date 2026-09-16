# Student Management System (Full-Stack)

A full-stack student management system with a React + TypeScript frontend and an Express + SQLite backend.

## Features

- CRUD operations (create, read, update, delete) over a RESTful API
- Pagination in the student list (10 students per page)
- Live search by name (debounced)
- Unique email validation and GPA (0.0–4.0) checks
- Client-side form validation
- Confirmation dialog before deletion
- Green/red toast notifications
- Loading spinner
- AZ / EN language switcher
- CORS and global error handling

## Tech Stack

| Side | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, fetch (async/await) |
| Backend | Node.js, Express 5, TypeScript, better-sqlite3 |

## Project Structure

```
StudentManager/
├── frontend/          # React + TypeScript (Vite)
│   └── src/
│       ├── api/           # API requests
│       ├── components/    # UI components
│       ├── contexts/      # Language & Toast contexts
│       ├── translations/  # AZ/EN translations
│       └── types/         # TypeScript types
└── backend/           # Express + SQLite
    └── src/
        ├── index.ts       # Server + CORS + global error handler
        ├── db.ts          # SQLite connection and table creation
        └── routes/        # CRUD endpoints
```

## Setup & Run

### 1. Backend (port 3000)

```bash
cd backend
npm install
npm run dev
```

### 2. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. The Vite dev server proxies `/api` requests to `http://localhost:3000`, so no extra configuration is required.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students?page=1&limit=10&search=ali` | List students (pagination + search) |
| `POST` | `/api/students` | Add a new student (201; duplicate email → 409) |
| `PUT` | `/api/students/:id` | Update a student (not found → 404) |
| `DELETE` | `/api/students/:id` | Delete a student (not found → 404) |

### Example response (GET)

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "Elvin",
      "last_name": "Aliyev",
      "major": "Computer Science",
      "email": "elvin@example.com",
      "gpa": 3.6,
      "created_at": "2026-09-07T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

## Build

```bash
# Backend (TypeScript → JavaScript)
cd backend && npm run build

# Frontend (production bundle)
cd frontend && npm run build
```