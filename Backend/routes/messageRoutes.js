const express = require('express')
const router = express.Router()
const {
  createConversation,
  getUserConversations,
  getConversationMessages,
  sendMessage,
  deleteMessage
} = require('../controllers/messageController')
const protectRoute = require('../middleware/protectRoute')

router.post('/conversations', protectRoute, createConversation)
router.get('/conversations', protectRoute, getUserConversations)
router.get('/:conversationId', protectRoute, getConversationMessages)
router.post('/', protectRoute, sendMessage)
router.delete('/:messageId', protectRoute, deleteMessage)

module.exports = router