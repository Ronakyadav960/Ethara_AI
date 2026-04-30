# Ethara Project Management Web Application

Full-stack project management application with JWT authentication, MongoDB, RBAC, project management, task tracking, and dashboard analytics.

## Stack

- Frontend: React, Tailwind CSS, Axios, React Router, Vite
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: bcrypt, JWT

## Folder Structure

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

## Step 1: Backend Setup

1. Open `backend/.env.example` and create a `.env` file from it.
2. Set:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
3. Install dependencies:

```bash
cd backend
npm install
```

4. Run locally:

```bash
npm run dev
```

Backend runs by default on `http://localhost:5000`.

### Backend API Endpoints

#### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

#### Projects

- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/members`
- `DELETE /api/projects/:id/members/:memberId`

#### Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

#### Dashboard

- `GET /api/dashboard`

#### Users

- `GET /api/users`

## Step 2: Frontend Setup

1. Open `frontend/.env.example` and create a `.env` file from it.
2. Set `VITE_API_URL=http://localhost:5000/api`
3. Install dependencies:

```bash
cd frontend
npm install
```

4. Run locally:

```bash
npm run dev
```

Frontend runs by default on `http://localhost:5173`.

## RBAC Summary

- Admin can create, edit, and delete projects.
- Admin can add and remove project members.
- Admin can create, assign, update, and delete tasks.
- Member can view assigned projects.
- Member can update status only on assigned tasks.

## Railway Deployment

### Backend

1. Push the repo to GitHub.
2. Create a new Railway project.
3. Select the `backend` folder as the service root.
4. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `PORT`
5. Set the start command to:

```bash
npm start
```

### Frontend

Deploy the frontend on Vercel, Netlify, or another static host and set:

```bash
VITE_API_URL=https://your-railway-backend-url/api
```

## Notes

- Passwords are hashed with bcrypt.
- JWT is required for all protected routes.
- Backend follows MVC architecture.
- UI is responsive and role-aware.
