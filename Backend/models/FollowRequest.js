const mongoose = require('mongoose')

const followRequestSchema = new mongoose.Schema({
  sender:   { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'declined'], 
    default: 'pending' 
  }
}, { timestamps: true })

followRequestSchema.index({ receiver: 1, status: 1 })
followRequestSchema.index({ sender: 1, receiver: 1 })

module.exports = mongoose.model('FollowRequest', followRequestSchema)