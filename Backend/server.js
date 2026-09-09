const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

// ⚡ Load environment variables FIRST
dotenv.config()

const connectDB = require('./config/db')
const { initSocket } = require('./socket/socket')

// Routes
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const followRoutes = require('./routes/followRoutes')
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')
const interactionRoutes = require('./routes/interactionRoutes')
const messageRoutes = require('./routes/messageRoutes')
const uploadRoutes = require('./routes/uploadRoutes')

connectDB().catch((err) => {
  console.error('Database initialization failed:', err.message)
})

const app = express()
const server = http.createServer(app)

// Required behind a reverse proxy (Render/Vercel/etc.) so secure cookies
// and req.secure work correctly.
app.set('trust proxy', 1)

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://talk-nest-psi.vercel.app'
].filter(Boolean)

// Socket.io initialize (shares the same allowed-origins list as the REST API)
initSocket(server, allowedOrigins)

app.use(helmet())
// Images now upload directly to Cloudinary from the browser, so request
// bodies only ever carry text/JSON — no need for a large body limit.
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ limit: '1mb', extended: true }))
app.use(cookieParser())
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later' }
})
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false
})
app.use('/api', apiLimiter)

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/follow', followRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/interactions', interactionRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/uploads', uploadRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// 404 handler
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Central error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})