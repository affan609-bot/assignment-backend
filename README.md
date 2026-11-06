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
| 2 | Backend structure | ✅ Done |
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

The server connects to MongoDB before it starts listening. Make sure MongoDB is
running locally, or use a MongoDB Atlas connection string in `MONGO_URI`.

If the connection fails, the server exits with a clear error instead of starting
in a broken state.

## Step 2: Backend structure

```text
backend/src/
  config/db.js                  MongoDB connection
  utils/asyncHandler.js         Async controller error wrapper
  utils/ApiError.js             Status code + message helper
  middleware/error.middleware.js 404 + centralized error handler
  app.js                        Express app configuration
  server.js                     DB connect, listen, graceful shutdown
```

Error responses always use the same shape:

```json
{
  "success": false,
  "message": "Route not found: GET /api/nope"
}
```

Common errors are converted automatically:

| Error | Status |
| --- | --- |
| Route not found | 404 |
| Mongoose validation | 400 |
| Invalid ObjectId | 400 |
| Duplicate unique field | 409 |
| Multer file too large | 400 |
| Invalid / expired JWT | 401 |

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
