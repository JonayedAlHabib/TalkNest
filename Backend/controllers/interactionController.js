const Interaction = require('../models/Interaction')
const Post = require('../models/post')
const Comment = require('../models/Comment')

// LIKE POST/COMMENT
const likeTarget = async (req, res) => {
  try {
    const { targetId, targetType } = req.body

    // Validate targetType
    if (!['post', 'comment'].includes(targetType)) {
      return res.status(400).json({ message: "Invalid target type" })
    }

    // Find the target
    const Model = targetType === 'post' ? Post : Comment
    const target = await Model.findById(targetId)

    if (!target) {
      return res.status(404).json({ message: `${targetType} not found` })
    }

    // Check if already liked
    const alreadyLiked = target.likes.includes(req.user._id)

    if (alreadyLiked) {
      return res.status(400).json({ message: `Already liked this ${targetType}` })
    }

    // Add like
    target.likes.push(req.user._id)
    await target.save()

    // Record interaction
    await Interaction.create({
      type: 'like',
      user: req.user._id,
      targetType,
      target: targetId
    })

    res.json({ message: `${targetType} liked successfully`, target })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// UNLIKE POST/COMMENT
const unlikeTarget = async (req, res) => {
  try {
    const { targetId, targetType } = req.body

    if (!['post', 'comment'].includes(targetType)) {
      return res.status(400).json({ message: "Invalid target type" })
    }

    const Model = targetType === 'post' ? Post : Comment
    const target = await Model.findById(targetId)

    if (!target) {
      return res.status(404).json({ message: `${targetType} not found` })
    }

    target.likes = target.likes.filter(
      userId => userId.toString() !== req.user._id.toString()
    )
    await target.save()

    // Record interaction
    await Interaction.create({
      type: 'unlike',
      user: req.user._id,
      targetType,
      target: targetId
    })

    res.json({ message: `${targetType} unliked successfully`, target })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET USER'S INTERACTIONS
const getUserInteractions = async (req, res) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 10 } = req.query

    const skip = (page - 1) * limit

    const interactions = await Interaction.find({ user: userId })
      .populate('user', 'fullName username')
      .populate({
        path: 'target',
        model: req.query.targetType === 'comment' ? 'Comment' : 'Post'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    res.json(interactions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET LIKES STATS
const getLikesStats = async (req, res) => {
  try {
    const { targetId, targetType } = req.query

    if (!['post', 'comment'].includes(targetType)) {
      return res.status(400).json({ message: "Invalid target type" })
    }

    const Model = targetType === 'post' ? Post : Comment
    const target = await Model.findById(targetId)
      .populate('likes', 'fullName username profilePicture')

    if (!target) {
      return res.status(404).json({ message: `${targetType} not found` })
    }

    res.json({
      totalLikes: target.likes.length,
      likes: target.likes
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  likeTarget,
  unlikeTarget,
  getUserInteractions,
  getLikesStats
}