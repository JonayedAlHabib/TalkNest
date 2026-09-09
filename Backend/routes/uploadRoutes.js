const express = require('express')
const router = express.Router()
const { getUploadSignature } = require('../controllers/uploadController')
const protectRoute = require('../middleware/protectRoute')

router.get('/signature', protectRoute, getUploadSignature)

module.exports = router
