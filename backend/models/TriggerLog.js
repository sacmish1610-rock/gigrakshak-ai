const mongoose = require("mongoose");

const triggerLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  policyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Policy"
  },
  triggerType: {
    type: String,
    enum: ["heavy_rain", "extreme_heat", "poor_aqi", "social_disruption", "severe_order_drop"],
    required: true
  },
  triggered: {
    type: Boolean,
    default: false
  },
  reason: {
    type: String
  },
  severity: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    default: "LOW"
  },
  conditions: {
    rain: Number,
    temperature: Number,
    aqi: Number,
    orderDrop: Number,
    riskScore: Number,
    weather: String,
    social: Boolean
  },
  claimCreated: {
    type: Boolean,
    default: false
  },
  claimId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Claim"
  },
  location: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("TriggerLog", triggerLogSchema);
