const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    text: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

messageSchema.pre('validate', function (next) {
    if (!this.text && !this.image) {
        return next(new Error('Message must have text or image'))
    }
    next()
})

module.exports = mongoose.model('Message', messageSchema)