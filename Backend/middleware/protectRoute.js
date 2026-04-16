const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protectRoute = async (req, res, next) =>{
    try {
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({ message : "Unauthorized - No token "})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select('-password')
        if(!user){
            return res.status(401).json({ message: "Unauthorized - User not found"})
        }
        req.user = user
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized - Invalid token"})
    }
}


module.exports = protectRoute;