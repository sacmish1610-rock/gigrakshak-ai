const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  dailyIncome: {
    type: Number,
    required: true
  },
  platform: {
    type: String,
    required: true
  },

  // 🔥 future AI ke liye
  riskScore: {
    type: Number,
    default: 0
  },
  recommendedPlan: {
    type: String,
    default: "Basic"
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);