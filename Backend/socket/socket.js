const { Server } = require('socket.io')

let io
const userSocketMap = {}

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId]
}

const getIO = () => io

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId

    if (userId) {
      userSocketMap[userId] = socket.id
      console.log(`User connected: ${userId}`)
    }

    // সব connected users কে online list পাঠাও
    io.emit('getOnlineUsers', Object.keys(userSocketMap))

    socket.on('disconnect', () => {
      if (userId) {
        delete userSocketMap[userId]
        console.log(`User disconnected: ${userId}`)
      }
      io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })
  })

  return io
}

module.exports = { initSocket, getReceiverSocketId, getIO }