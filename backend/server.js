const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import middleware
const { requestLogger } = require("./middleware/logger");
const { responseHandler } = require("./middleware/responseHandler");
const { errorHandler, asyncHandler } = require("./middleware/errorHandler");

// Import routes
const userRoutes = require("./routes/userRoutes");
const riskRoutes = require("./routes/riskRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const policyRoutes = require("./routes/policyRoutes");
const triggerRoutes = require("./routes/triggerRoutes");
const claimRoutes = require("./routes/claimRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const authRoutes = require("./routes/authRoutes");
const pincodeRoutes = require("./routes/pincodeRoutes");

const app = express();

// ============================================
// 🔹 SECURITY: Rate Limiting
// ============================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "❌ Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Stricter limit for auth endpoints (brute force protection)
  message: "❌ Too many login attempts, please try again later",
  skipSuccessfulRequests: true, // Don't count successful requests
});

// ============================================
// 🔹 MIDDLEWARE
// ============================================
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Logging middleware
app.use(requestLogger);

// Response standardization
app.use(responseHandler);

// Apply rate limiting to all routes
app.use(limiter);

// ============================================
// 🔹 ROUTES
// ============================================

// Health check (before auth)
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "✅ Server is healthy",
    data: {
      version: "2.0.0",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development"
    }
  });
});

// Auth routes (with stricter rate limiting)
app.use("/api/auth", authLimiter, authRoutes);

// Other routes
app.use("/api/users", userRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/policy", policyRoutes);
app.use("/api/trigger", triggerRoutes);
app.use("/api/claim", claimRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/pincode", pincodeRoutes);

// ============================================
// 🔹 DATABASE CONNECTION
// ============================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Exit if cannot connect to DB
  });

// ============================================
// 🔹 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "❌ Route not found",
    path: req.path
  });
});

// ============================================
// 🔹 GLOBAL ERROR HANDLER (Must be last)
// ============================================
app.use(errorHandler);

// ============================================
// 🔹 SERVER START
// ============================================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 GigRakshak AI Backend v2.0      ║
║   ✅ Server Running on Port ${PORT}     ║
║   📋 Environment: ${(process.env.NODE_ENV || "development").toUpperCase()}         ║
║   🗄️  MongoDB: Connected            ║
║   🔒 Rate Limiting: Enabled         ║
╚════════════════════════════════════════╝
  `);
});

// ============================================
// 🔹 GRACEFUL SHUTDOWN
// ============================================
process.on("SIGTERM", () => {
  console.log("📍 SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

module.exports = app;
