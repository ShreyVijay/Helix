# Helix

A real-time full-stack chat application built with React, Node.js, and Socket.io. Helix lets users sign up, find other users, and exchange text messages and images instantly.

**Live demo:** https://loopin-frontend.onrender.com

## Features

- **Authentication** - Secure sign-up, login, and logout with JWT cookies and bcrypt password hashing
- **Real-time messaging** - Instant message delivery powered by Socket.io
- **Image sharing** - Send images in chat, uploaded via Cloudinary
- **Online presence** - See which users are currently online
- **User profiles** - Update your display name and avatar
- **Redux state management** - Predictable global state for messages and users

## Tech Stack

### Backend

| Package | Purpose |
|---|---|
| Express 5 | HTTP server and REST API |
| Mongoose | MongoDB ODM |
| Socket.io | Real-time bidirectional communication |
| jsonwebtoken | JWT-based authentication |
| bcryptjs | Password hashing |
| Cloudinary | Cloud image storage |
| Multer | Multipart file upload handling |
| cookie-parser | Cookie middleware |
| dotenv | Environment variable management |

### Frontend

| Package | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool and dev server |
| React Router DOM v7 | Client-side routing |
| Redux Toolkit + React Redux | Global state management |
| Socket.io-client | Real-time connection to server |
| Axios | HTTP requests |
| Tailwind CSS | Utility-first styling |
| emoji-picker-react | In-chat emoji support |
| react-icons | Icon library |

## Project Structure

```text
Helix/
  backend/
    config/
    controllers/
    middlewares/
    models/
    routes/
    socket/
    index.js
  frontend/
    public/
    src/
      components/
      customHooks/
      pages/
      redux/
      App.jsx
```

## API Reference

### Auth - `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register a new user |
| POST | `/login` | Log in and receive a JWT cookie |
| GET | `/logout` | Clear the auth cookie |

### Messages - `/api/message` (requires auth)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/send/:receiverId` | Send a message with text, an image, or both |
| GET | `/get/:receiverId` | Fetch conversation with a user |

### Users - `/api/user` (requires auth)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all users except the current one |
| GET | `/search` | Search users |
| PUT | `/profile` | Update profile name and/or avatar |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB local or Atlas
- A Cloudinary account

### Backend

```bash
cd backend
npm install
npm run dev
```

Create `backend/.env` from `backend/.env.example` with:

```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=http://localhost:5173
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`. It uses `VITE_API_URL` for the API address and defaults to `http://localhost:5000` for local development.

## Deployment

### Render deployment

This repository includes a Render Blueprint in `render.yaml` for a Node web service and a Vite static site. In Render, create a new Blueprint and select this repository. Render will prompt for `MONGODB_URL` and the three Cloudinary values. `JWT_SECRET` is generated automatically; service URLs and frontend CORS are wired from the Blueprint.

Before deploying, create a MongoDB Atlas database and allow connections from Render (Atlas Network Access may require `0.0.0.0/0` when using Render's shared outbound IPs). Create a Cloudinary account for image uploads. Keep these values in Render's environment settings and do not commit credentials.

The API health endpoint is `/health`. Render's static site rewrite sends client-side routes to `index.html`.

## License

ISC
