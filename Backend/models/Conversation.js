const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    lastMessageTime: {
        type: Date,
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model('Conversation', conversationSchema)