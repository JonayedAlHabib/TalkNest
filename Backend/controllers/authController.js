const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
  const isProduction = process.env.NODE_ENV === 'production'

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
  })
}

// Register

const register = async (req, res)=>{
    try {
        const {fullName, username, email, password, gender, dateOfBirth } = req.body
        if(!fullName || !username || !email || !password){
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await User.findOne({ $or: [{email}, {username}] })
        if(existingUser){
            return res.status(400).json({ message: "Email or username already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            fullName,
            username,
            email,
            password: hashedPassword,
            gender,
            dateOfBirth
        })

        generateToken(user._id, res)

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture
        })
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}

// login
const login = async  (req, res)=>{
    try {
        const { email, password } = req.body

    const user = await User.findOne({ email })
    if(!user){
        return res.status(400).json({message: "Invalid email or password"})
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.status(400).json({message: "Invalid email or password"})
    }

    generateToken( user._id, res)
    
    res.json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture
    })
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}

// logOut

const logout = async (req, res) =>{
    res.cookie('jwt', '', {maxAge: 0})
    res.json({message: "Logged out successfully"})
}

//get me

const getMe = async (req, res)=>{
    res.json(req.user)
}

module.exports = { register, login, logout, getMe}