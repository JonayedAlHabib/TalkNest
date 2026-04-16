const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// GET USER PROFILE BY USERNAME
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE OWN PROFILE
const updateProfile = async (req, res) => {
  try {
    const { bio, location, fullName, profilePicture } = req.body;
    let imageUrl = req.user.profilePicture;

    // নতুন image upload হলে cloudinary তে পাঠাও
    if (profilePicture && profilePicture.startsWith("data:image")) {
      const uploaded = await cloudinary.uploader.upload(profilePicture, {
        folder: "talknest/profiles",
      });
      imageUrl = uploaded.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { bio, location, fullName, profilePicture: imageUrl },
      { new: true },
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SEARCH USERS
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    const users = await User.find({
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
      _id: { $ne: req.user._id },
    })
      .select("fullName username profilePicture")
      .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, updateProfile, searchUsers };
