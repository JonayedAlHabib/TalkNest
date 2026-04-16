const express = require('express')
const router = express.Router()
const {
    createComment,
    getPostComments,
    editComment,
    deleteComment,
    likeComment
} = require('../controllers/commentController')
const protectRoute = require('../middleware/protectRoute')

router.post('/:postId', protectRoute, createComment)
router.get('/:postId', protectRoute, getPostComments)
router.put('/:commentId', protectRoute, editComment)
router.delete('/:commentId', protectRoute, deleteComment)
router.post('/:commentId/like', protectRoute, likeComment)

module.exports = router