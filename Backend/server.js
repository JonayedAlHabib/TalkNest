const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')

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

connectDB().catch((err) => {
  console.error('Database initialization failed:', err.message)
})

const app = express()
const server = http.createServer(app)

// Socket.io initialize
initSocket(server)

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/follow', followRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/interactions', interactionRoutes)
app.use('/api/messages', messageRoutes)

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})