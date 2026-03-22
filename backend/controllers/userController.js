const User = require("../models/User");

// REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { name, location, dailyIncome, platform } = req.body;

    const user = new User({
      name,
      location,
      dailyIncome,
      platform
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully ✅",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error.message
    });
  }
};