const express = require('express')
const router = express.Router()
const { sendRequest, respondRequest, getPendingRequests, unfollow } = require('../controllers/followerController')
const protectRoute = require('../middleware/protectRoute')

router.post('/send/:targetUserId', protectRoute, sendRequest)
router.put('/respond/:requestId', protectRoute, respondRequest)
router.get('/pending', protectRoute, getPendingRequests)
router.delete('/unfollow/:targetUserId', protectRoute, unfollow)

module.exports = router