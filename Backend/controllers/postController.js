const Post = require('../models/post')
const cloudinary = require('../config/cloudinary')
const User = require('../models/User')


// Create post
const createPost = async (req, res) =>{
    try {
    const { content, image } = req.body
    
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" })
    }

    let imageUrl = ""
    
    if (image && image.startsWith("data:image")) {
      const uploaded = await cloudinary.uploader.upload(image, {
        folder: "talknest/posts"
      })
      imageUrl = uploaded.secure_url
    }

    const post = await Post.create({
      content,
      image: imageUrl,
      author: req.user._id
    })

    await post.populate('author', 'fullName username profilePicture')

    res.status(201).json({
      message: "Post created successfully",
      post
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get All Post
const getAllPost = async (req, res) =>{
    try {
    const { page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    const posts = await Post.find()
      .populate('author', 'fullName username profilePicture')
      .populate('comments')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Post.countDocuments()

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      posts
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get User Post
const getUserPosts = async (req, res) =>{
    try {
    const { userId } = req.params
    const { page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    const posts = await Post.find({ author: userId })
      .populate('author', 'fullName username profilePicture')
      .populate('comments')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Post
const getPost = async (req, res) =>{
    try {
    const { postId } = req.params

    const post = await Post.findById(postId)
      .populate('author', 'fullName username profilePicture')
      .populate('comments')

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    res.json(post)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Edit Post
const editPost = async (req, res) =>{
    try {
    const { postId } = req.params
    const { content, image } = req.body

    const post = await Post.findById(postId)
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this post" })
    }

    if (content) {
      post.content = content
    }

    if (image && image.startsWith("data:image")) {
      const uploaded = await cloudinary.uploader.upload(image, {
        folder: "talknest/posts"
      })
      post.image = uploaded.secure_url
    }

    const updatedPost = await post.save()
    await updatedPost.populate('author', 'fullName username profilePicture')

    res.json({
      message: "Post updated successfully",
      post: updatedPost
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete Post
const deletePost = async (req, res) =>{
    try {
    const { postId } = req.params

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" })
    }

    await Post.findByIdAndDelete(postId)

    res.json({ message: "Post deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Like Post
const likePost = async (req, res) =>{
    try {
    const { postId } = req.params

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    const alreadyLiked = post.likes.includes(req.user._id)

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        userId => userId.toString() !== req.user._id.toString()
      )
      await post.save()
      return res.json({ message: "Post unliked", post })
    }

    post.likes.push(req.user._id)
    await post.save()

    res.json({ message: "Post liked", post })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Unlike Post 
const unlikePost = async (req, res) =>{
    try {
    const { postId } = req.params

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    post.likes = post.likes.filter(
      userId => userId.toString() !== req.user._id.toString()
    )
    await post.save()

    res.json({ message: "Post unliked", post })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Post Likes
const getPostLikes = async (req, res) =>{
    try {
    const { postId } = req.params

    const post = await Post.findById(postId)
      .populate('likes', 'fullName username profilePicture')

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    res.json({
      totalLikes: post.likes.length,
      likes: post.likes
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// GET FEED 
const getFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id)

    // আমি যাদের follow করি + আমার নিজের posts
    const feedUsers = [...currentUser.following, req.user._id]

    const { page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    const posts = await Post.find({ author: { $in: feedUsers } })
      .populate('author', 'fullName username profilePicture')
      .populate('comments')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
    createPost,
    getAllPost,
    getUserPosts,
    getPost,
    editPost,
    deletePost,
    likePost,
    unlikePost,
    getPostLikes,
    getFeed
}