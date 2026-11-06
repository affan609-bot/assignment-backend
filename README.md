# Products Admin (MERN-style)

**Products Listing & File Uploading System with Node.js Backend and Admin Panel**

A learning project built step by step.

## Stack

- Node.js + Express.js (backend)
- MongoDB + Mongoose (database)
- JWT + bcrypt (admin authentication)
- Multer (single + multiple image uploads)
- React + Vite (admin panel)
- Axios (API calls)
- Plain CSS (admin panel styling)

## Build progress

| Step | Topic | Status |
| --- | --- | --- |
| 1 | Project setup | ✅ Done |
| 2 | Backend structure | ⏳ Pending |
| 3 | MongoDB models | ⏳ Pending |
| 4 | Admin authentication | ⏳ Pending |
| 5 | Products CRUD | ⏳ Pending |
| 6 | Multer file uploads | ⏳ Pending |
| 7 | Postman testing | ⏳ Pending |
| 8 | React admin panel | ⏳ Pending |
| 9 | Axios integration | ⏳ Pending |
| 10 | Final testing | ⏳ Pending |

## Planned project structure

```text
backend/
  src/
    config/          MongoDB connection
    models/          Admin + Product schemas
    controllers/     Request logic
    routes/          Express routes
    middleware/      Auth, upload, errors
    utils/           Helpers
    app.js           Express app
    server.js        Server entry point
  uploads/           Uploaded product images
  scripts/           Admin creation + API tests
  .env.example
  package.json
admin-panel/
  src/
    api/             Axios instance
    components/      Reusable UI
    context/         Auth state
    pages/           Login, Dashboard, Products, Uploads
    App.jsx
    main.jsx
  index.html
  vite.config.js
  package.json
postman/
  Products-API.postman_collection.json
README.md
```

## Step 1: Run the backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Open:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Products Admin API is running.",
  "environment": "development",
  "timestamp": "..."
}
```

## MongoDB note

This step does not connect to MongoDB yet. In the next steps we will add the
connection and models. Make sure MongoDB is running locally, or use a MongoDB
Atlas connection string in `MONGO_URI`.

## Environment variables

All values live in `backend/.env` (copied from `backend/.env.example`):

| Variable | Purpose |
| --- | --- |
| `PORT` | Express server port |
| `NODE_ENV` | Development or production |
| `CLIENT_URL` | React admin panel origin for CORS |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `JWT_EXPIRES_IN` | Token lifetime |
| `ADMIN_NAME` | Name used by the admin creation script |
| `ADMIN_EMAIL` | Email used by the admin creation script |
| `ADMIN_PASSWORD` | Password used by the admin creation script |

> Never commit `backend/.env`.
