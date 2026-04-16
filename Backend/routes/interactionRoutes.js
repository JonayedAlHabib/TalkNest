const express = require('express')
const router = express.Router()
const {
  likeTarget,
  unlikeTarget,
  getUserInteractions,
  getLikesStats
} = require('../controllers/interactionController')
const protectRoute = require('../middleware/protectRoute')

router.post('/like', protectRoute, likeTarget)
router.post('/unlike', protectRoute, unlikeTarget)
router.get('/user/:userId', protectRoute, getUserInteractions)
router.get('/stats', protectRoute, getLikesStats)

module.exports = router