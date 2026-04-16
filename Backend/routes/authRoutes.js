const express = require('express')
const router = express.Router()
const { register, login, logout, getMe } = require('../controllers/authController')
const protectRoute = require('../middleware/protectRoute')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', protectRoute, getMe)

module.exports = router