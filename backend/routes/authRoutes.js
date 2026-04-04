const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe, refreshToken } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (require JWT token)
router.get("/me", protect, getMe);
router.post("/refresh-token", protect, refreshToken);

module.exports = router;

