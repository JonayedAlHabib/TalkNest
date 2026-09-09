const User = require("../models/User");

// GET USER PROFILE BY USERNAME
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE OWN PROFILE
// `profilePicture`, when present, is already a Cloudinary URL uploaded
// directly from the client (see /api/uploads/signature).
const updateProfile = async (req, res) => {
  try {
    const { bio, location, fullName, profilePicture } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        bio,
        location,
        fullName,
        profilePicture: profilePicture || req.user.profilePicture,
      },
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
      .limit(10)
      .lean();

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, updateProfile, searchUsers };
