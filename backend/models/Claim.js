const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  policyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Policy"
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  reason: {
    type: String,
    default: "Parametric trigger-based claim"
  },
  triggerType: {
    type: String,
    enum: ["heavy_rain", "extreme_heat", "poor_aqi", "social_disruption", "severe_order_drop", "manual", "other"],
    default: "other"
  },
  severity: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    default: "MEDIUM"
  },
  fraudScore: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"],
    default: "LOW"
  },
  status: {
    type: String,
    enum: ["APPROVED", "PENDING", "REJECTED", "PROCESSING"],
    default: "APPROVED"
  },
  // Freeze weather data at claim time for audit trail
  weatherSnapshot: {
    temperature: Number,
    weather: String,
    rainInLastHour: Number,
    aqi: Number,
    orderDrop: Number,
    humidity: Number,
    windSpeed: Number
  },
  payoutMethod: {
    type: String,
    enum: ["UPI", "Bank Transfer", "Wallet"],
    default: "UPI"
  },
  processingTimeMs: {
    type: Number,
    default: 0
  },
  approvedAt: {
    type: Date
  },
  incomeAtClaim: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Claim", claimSchema);