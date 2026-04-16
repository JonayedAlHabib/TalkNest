# TalkNest 🐦

A full-stack text-based social networking platform built with the MERN stack.

## Features
- JWT Authentication with httpOnly cookies
- Request-based follow system
- Text posts with likes and comments
- Real-time chat with Socket.io
- Profile management with Cloudinary
- User search with live suggestions

## Tech Stack
**Backend:** Node.js, Express.js, MongoDB, Mongoose, Socket.io  
**Frontend:** React.js, Tailwind CSS, Zustand, Axios  
**Tools:** Cloudinary, JWT, bcryptjs

## Project Structure
TalkNest/
├── Backend/    → Node.js + Express API
└── Frontend/   → React + Vite

## Setup

### Backend
```bash
cd Backend
npm install
# .env file 
npm start
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

### Environment Variables
Backend/.env 
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/posts/feed | Get feed |
| POST | /api/follow/send/:id | Follow request |