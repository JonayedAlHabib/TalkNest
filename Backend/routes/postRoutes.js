const express = require('express')
const router = express.Router()
const {
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
} = require('../controllers/postController')
const protectRoute = require('../middleware/protectRoute')

// ✅ Specific routes আগে রাখো
router.get('/feed', protectRoute, getFeed)           // ← আগে
router.get('/user/:userId', protectRoute, getUserPosts)

// ✅ Dynamic routes পরে রাখো
router.post('/', protectRoute, createPost)
router.get('/', protectRoute, getAllPost)
router.get('/:postId', protectRoute, getPost)        // ← পরে
router.put('/:postId', protectRoute, editPost)
router.delete('/:postId', protectRoute, deletePost)
router.post('/:postId/like', protectRoute, likePost)
router.delete('/:postId/like', protectRoute, unlikePost)
router.get('/:postId/likes', protectRoute, getPostLikes)

module.exports = router