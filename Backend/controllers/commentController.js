const Comment = require('../models/Comment')
const Post = require('../models/post')

// CREATE COMMENT
const createComment = async (req, res) => {
  try {
    const { text } = req.body
    const { postId } = req.params

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" })
    }

    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    const comment = await Comment.create({
      text,
      author: req.user._id,
      post: postId
    })

    await comment.populate('author', 'fullName username profilePicture')
    
    post.comments.push(comment._id)
    await post.save()

    res.status(201).json({
      message: "Comment created successfully",
      comment
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET POST COMMENTS
const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params
    const { page = 1, limit = 10 } = req.query

    const skip = (page - 1) * limit

    const comments = await Comment.find({ post: postId })
      .populate('author', 'fullName username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Comment.countDocuments({ post: postId })

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      comments
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// EDIT COMMENT
const editComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const { text } = req.body

    const comment = await Comment.findById(commentId)

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" })
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this comment" })
    }

    comment.text = text
    const updatedComment = await comment.save()
    await updatedComment.populate('author', 'fullName username profilePicture')

    res.json({
      message: "Comment updated successfully",
      comment: updatedComment
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE COMMENT
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params

    const comment = await Comment.findById(commentId)

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" })
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" })
    }

    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId }
    })

    await Comment.findByIdAndDelete(commentId)

    res.json({ message: "Comment deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// LIKE COMMENT
const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params

    const comment = await Comment.findById(commentId)

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" })
    }

    const alreadyLiked = comment.likes.includes(req.user._id)

    if (alreadyLiked) {
      comment.likes = comment.likes.filter(
        userId => userId.toString() !== req.user._id.toString()
      )
      await comment.save()
      return res.json({ message: "Comment unliked", comment })
    }

    comment.likes.push(req.user._id)
    await comment.save()

    res.json({ message: "Comment liked", comment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createComment,
  getPostComments,
  editComment,
  deleteComment,
  likeComment
}