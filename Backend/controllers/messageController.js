const Message = require('../models/Message')
const Conversation = require('../models/Conversation')
const cloudinary = require('../config/cloudinary')
const { getReceiverSocketId, getIO } = require('../socket/socket')

// CREATE OR GET CONVERSATION
const createConversation = async (req, res) => {
  try {
    const { recipientId } = req.body

    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot start conversation with yourself" })
    }

    let conversation = await Conversation.findOne({
      members: { $all: [req.user._id, recipientId] }
    })

    if (!conversation) {
      conversation = await Conversation.create({
        members: [req.user._id, recipientId]
      })
    }

    await conversation.populate('members', 'fullName username profilePicture')

    res.json(conversation)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET USER CONVERSATIONS
const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ members: req.user._id })
      .populate('members', 'fullName username profilePicture')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username' }
      })
      .sort({ lastMessageTime: -1 })

    res.json(conversations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET CONVERSATION MESSAGES
const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params
    const { page = 1, limit = 20 } = req.query

    const skip = (page - 1) * limit

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'fullName username profilePicture')
      .populate('receiver', 'fullName username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    // Mark messages as read
    await Message.updateMany(
      { conversation: conversationId, receiver: req.user._id, isRead: false },
      { isRead: true }
    )

    res.json(messages.reverse())
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const { conversationId, receiverId, text, image } = req.body

    if (!text && !image) {
      return res.status(400).json({ message: 'Message must have text or image' })
    }

    let imageUrl = ''
    if (image && image.startsWith('data:image')) {
      const uploaded = await cloudinary.uploader.upload(image, {
        folder: 'talknest/messages'
      })
      imageUrl = uploaded.secure_url
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      conversation: conversationId,
      text,
      image: imageUrl
    })

    await message.populate('sender', 'fullName username profilePicture')

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageTime: new Date()
    })

    // ✅ Real-time emit — receiver online থাকলে instantly পাঠাও
    const receiverSocketId = getReceiverSocketId(receiverId)
    if (receiverSocketId) {
      getIO().to(receiverSocketId).emit('newMessage', message)
    }

    res.status(201).json({ message: 'Message sent', data: message })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE MESSAGE
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params

    const message = await Message.findById(messageId)

    if (!message) {
      return res.status(404).json({ message: "Message not found" })
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this message" })
    }

    await Message.findByIdAndDelete(messageId)

    res.json({ message: "Message deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}



module.exports = {
  createConversation,
  getUserConversations,
  getConversationMessages,
  sendMessage,
  deleteMessage
}