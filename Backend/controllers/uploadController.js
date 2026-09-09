const cloudinary = require('../config/cloudinary')

// Only allow uploads into known folders — never accept an arbitrary path from the client
const ALLOWED_FOLDERS = {
  posts: 'talknest/posts',
  messages: 'talknest/messages',
  profiles: 'talknest/profiles'
}

// Returns a short-lived signature so the browser can upload the image
// straight to Cloudinary instead of proxying the base64 payload through our server.
const getUploadSignature = async (req, res) => {
  try {
    const key = req.query.folder
    const folder = ALLOWED_FOLDERS[key]

    if (!folder) {
      return res.status(400).json({ message: 'Invalid or missing folder' })
    }

    const timestamp = Math.round(Date.now() / 1000)
    const paramsToSign = { timestamp, folder }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    )

    res.json({
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getUploadSignature }
