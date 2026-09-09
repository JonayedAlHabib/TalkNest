const mongoose = require('mongoose')

const interactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['like', 'unlike'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    targetType: {
        type: String,
        enum: ['post', 'comment'],
        required: true
    },
    target: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'targetType'
    }
}, { timestamps: true })

interactionSchema.index({ user: 1, createdAt: -1 })
interactionSchema.index({ targetType: 1, target: 1 })

module.exports = mongoose.model('Interaction', interactionSchema)