# Ethara AI Project Management App

Full-stack project management application built with React, Express, and MongoDB. The app supports authentication, role-based access control, project management, task assignment, and dashboard analytics.

Repository:
`https://github.com/Ronakyadav960/Ethara_AI`

## Tech Stack

- Frontend: React, Tailwind CSS, Axios, React Router, Vite
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: bcrypt, JWT

## Features

- User signup and login
- JWT-protected APIs
- Admin and Member roles
- Project creation and management
- Team member assignment
- Task creation, assignment, tracking, and status updates
- Dashboard task analytics
- Responsive UI

## RBAC Summary

- Admin can create, update, and delete projects
- Admin can add and remove project members
- Admin can create, assign, update, and delete tasks
- Member can only view projects where tasks are assigned to them
- Member can only update the status of their own assigned tasks

## Project Structure

```text
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
    components/
    context/
    pages/
    services/
```

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/Ronakyadav960/Ethara_AI.git
cd Ethara_AI
```

### 2. Backend setup

Create `backend/.env` from [backend/.env.example](backend/.env.example):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ethara_pm
JWT_SECRET=replace_with_a_strong_secret
CLIENT_URL=http://localhost:5173
```

Install and run:

```bash
cd backend
npm install
npm run dev
```

Backend runs at `http://localhost:5000`.

### 3. Frontend setup

Create `frontend/.env` from [frontend/.env.example](frontend/.env.example):

```env
VITE_API_URL=http://localhost:5000/api
```

Install and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Demo Notes

- Public signup creates `Member` accounts only
- For demo use, create an admin manually in MongoDB or update one user record's `role` to `Admin`
- Members only see projects where they have assigned tasks

## API Routes

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

### Projects

- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/members`
- `DELETE /api/projects/:id/members/:memberId`

### Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Dashboard

- `GET /api/dashboard`

### Users

- `GET /api/users`

## Railway Backend Deployment

### Backend service

1. Push the repo to GitHub
2. In Railway, create a new project from GitHub
3. Select this repository
4. Configure the service root directory as `backend`
5. Add these environment variables:

```env
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=https://your-frontend-domain.com
```

6. Use the start command:

```bash
npm start
```

### Health check

After deployment, verify:

- `GET /api/health`

Example:

```text
https://your-railway-app.up.railway.app/api/health
```

## Frontend Deployment

Deploy `frontend` on Vercel, Netlify, or another static host.

Set:

```env
VITE_API_URL=https://your-railway-app.up.railway.app/api
```

Then run build:

```bash
cd frontend
npm run build
```

## Recommended Next Improvements

- Add an admin seed script
- Add Joi or Zod validation
- Add rate limiting and Helmet
- Add pagination and search
- Add automated tests
- Add better token expiry handling on the frontend

## Notes

- Passwords are hashed with bcrypt
- Backend follows MVC structure
- All protected routes use JWT auth middleware
- This repo is demo-ready, but not fully production-hardened yet
