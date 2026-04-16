const FollowRequest = require('../models/FollowRequest')
const User = require('../models/User')

// SEND FOLLOW REQUEST
const sendRequest = async (req, res) => {
  try {
    const { targetUserId } = req.params

    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ message: "Can't follow myself." })
    }

    const existing = await FollowRequest.findOne({
      sender: req.user._id,
      receiver: targetUserId,
      status: 'pending'
    })
    if (existing) {
      return res.status(400).json({ message: 'Request already sent' })
    }

    const request = await FollowRequest.create({
      sender: req.user._id,
      receiver: targetUserId
    })

    res.status(201).json({ message: 'Follow request sent', request })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ACCEPT OR DECLINE REQUEST
const respondRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const { action } = req.body // 'accept' or 'decline'

    const request = await FollowRequest.findById(requestId)

    if (!request || request.receiver.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Request not found' })
    }

    if (action === 'accept') {
      request.status = 'accepted'
      await request.save()

      // Update the list of two people
      await User.findByIdAndUpdate(request.sender, {
        $addToSet: { following: request.receiver }
      })
      await User.findByIdAndUpdate(request.receiver, {
        $addToSet: { followers: request.sender }
      })

      return res.json({ message: 'Request accepted' })
    }

    if (action === 'decline') {
      request.status = 'declined'
      await request.save()
      return res.json({ message: 'Request declined' })
    }

    res.status(400).json({ message: 'Invalid action' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET PENDING REQUESTS 
const getPendingRequests = async (req, res) => {
  try {
    const requests = await FollowRequest.find({
      receiver: req.user._id,
      status: 'pending'
    }).populate('sender', 'fullName username profilePicture')

    res.json(requests)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// UNFOLLOW
const unfollow = async (req, res) => {
  try {
    const { targetUserId } = req.params

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: targetUserId }
    })
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: req.user._id }
    })
    await FollowRequest.findOneAndDelete({
      sender: req.user._id,
      receiver: targetUserId
    })

    res.json({ message: 'Unfollowed successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { sendRequest, respondRequest, getPendingRequests, unfollow }