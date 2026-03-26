const User = require("../models/User");

// 📝 Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, location, zone, dailyIncome, platform, vehicleType, workingHours, experienceMonths } = req.body;

    // Validate required fields
    if (!name || !location || !dailyIncome || !platform) {
      return res.status(400).json({
        message: "❌ Name, location, daily income, and platform are required",
        success: false
      });
    }

    if (isNaN(dailyIncome) || dailyIncome <= 0) {
      return res.status(400).json({
        message: "❌ Daily income must be a valid positive number",
        success: false
      });
    }

    const user = new User({
      name: name.trim(),
      email: email ? email.trim().toLowerCase() : undefined,
      phone: phone ? phone.trim() : undefined,
      location: location.trim(),
      zone: zone || location.trim(),
      dailyIncome: parseFloat(dailyIncome),
      platform,
      vehicleType: vehicleType || "Bike",
      workingHours: workingHours || 8,
      experienceMonths: experienceMonths || 0
    });

    await user.save();

    res.status(201).json({
      message: "✅ User registered successfully",
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "❌ Error registering user",
      success: false,
      error: error.message
    });
  }
};

// 👤 Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "❌ User not found", success: false });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching user", success: false, error: error.message });
  }
};

// ✏️ Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ message: "❌ User not found", success: false });
    }

    res.json({ message: "✅ Profile updated", success: true, user });
  } catch (error) {
    res.status(500).json({ message: "❌ Error updating profile", success: false, error: error.message });
  }
};

// 📋 Get All Users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching users", success: false, error: error.message });
  }
};