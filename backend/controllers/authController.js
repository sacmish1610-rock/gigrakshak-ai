const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ============================================
// 🔐 REGISTER USER
// ============================================
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, pincode, city, state, workType, vehicleType, experience, income } = req.body;

    // Validation
    if (!name || !email || !password || !pincode || !workType || !income) {
      return res.status(400).json({ 
        success: false, 
        message: "❌ Please fill in all required fields" 
      });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "❌ Password must be at least 6 characters" 
      });
    }

    // Email validation (basic regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "❌ Invalid email format" 
      });
    }

    // Pincode validation (6 digits)
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ 
        success: false, 
        message: "❌ Pincode must be exactly 6 digits" 
      });
    }

    // Check if user already exists
    let userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: "❌ Email already registered" 
      });
    }

    // Hash password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Calculate initial risk score
    let riskScore = 20; 
    let recommendedPlan = "Basic";
    if (vehicleType === "Bike") riskScore += 10;
    if (experience < 6) riskScore += 15;
    
    if (riskScore > 40) recommendedPlan = "Pro";
    else if (riskScore > 25) recommendedPlan = "Standard";

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone ? phone.trim() : "",
      pincode: pincode.trim(),
      city: (city || "").trim(),
      state: (state || "").trim(),
      workType,
      vehicleType: vehicleType || "Bike",
      experience: parseFloat(experience) || 0,
      income: parseFloat(income),
      riskScore,
      recommendedPlan
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "✅ Registration successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          workType: user.workType,
          riskScore: user.riskScore,
          recommendedPlan: user.recommendedPlan
        }
      }
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    
    // Handle MongoDB duplicate error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "❌ Email already registered" 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: "❌ Registration failed", 
      error: process.env.NODE_ENV === "development" ? error.message : undefined 
    });
  }
};

// ============================================
// 🔓 LOGIN USER
// ============================================
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "❌ Please provide email and password" 
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "❌ Invalid email or password" 
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "❌ Invalid email or password" 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "✅ Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          workType: user.workType,
          income: user.income,
          riskScore: user.riskScore,
          recommendedPlan: user.recommendedPlan,
          city: user.city,
          state: user.state
        }
      }
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "❌ Login failed", 
      error: process.env.NODE_ENV === "development" ? error.message : undefined 
    });
  }
};

// ============================================
// 👤 GET CURRENT USER (Protected Route)
// ============================================
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "❌ User not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ User retrieved",
      data: { user }
    });
  } catch (error) {
    console.error("❌ GetMe Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "❌ Failed to retrieve user" 
    });
  }
};

// ============================================
// 🔄 REFRESH TOKEN
// ============================================
exports.refreshToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "❌ User not found" 
      });
    }

    const newToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "✅ Token refreshed",
      data: { token: newToken }
    });
  } catch (error) {
    console.error("❌ Refresh Token Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "❌ Failed to refresh token" 
    });
  }
};

// ============================================
// 🔑 GENERATE JWT TOKEN
// ============================================
const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: "30d",
      algorithm: "HS256"
    }
  );
};

exports.generateToken = generateToken;

