const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Import routes
const userRoutes = require("./routes/userRoutes");
const riskRoutes = require("./routes/riskRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const policyRoutes = require("./routes/policyRoutes");
const triggerRoutes = require("./routes/triggerRoutes");
const claimRoutes = require("./routes/claimRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(express.json());

// 🔹 API Routes
app.use("/api/users", userRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/policy", policyRoutes);
app.use("/api/trigger", triggerRoutes);
app.use("/api/claim", claimRoutes);
app.use("/api/analytics", analyticsRoutes);

// 🔹 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌", err));

// 🔹 Health Check
app.get("/", (req, res) => {
  res.json({
    message: "GigRakshak AI Backend v2.0 🚀",
    version: "2.0.0",
    endpoints: {
      users: "/api/users",
      risk: "/api/risk",
      pricing: "/api/pricing",
      policy: "/api/policy",
      trigger: "/api/trigger",
      claims: "/api/claim",
      analytics: "/api/analytics"
    }
  });
});

// 🔹 Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled Error:", err.message);
  res.status(500).json({
    message: "Internal server error",
    success: false,
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
  });
});

// 🔹 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: "❌ Route not found",
    success: false,
    path: req.path
  });
});

// 🔹 Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 GigRakshak AI Backend v2.0 running on port ${PORT}`);
});