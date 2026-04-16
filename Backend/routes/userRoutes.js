const express = require('express')
const router = express.Router()
const { getUserProfile, updateProfile, searchUsers } = require('../controllers/userController')
const protectRoute = require('../middleware/protectRoute')

router.get('/search', protectRoute, searchUsers)
router.get('/:username', protectRoute, getUserProfile)
router.put('/update/profile', protectRoute, updateProfile)

module.exports = router