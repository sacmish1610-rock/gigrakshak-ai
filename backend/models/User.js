const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  zone: {
    type: String,
    trim: true,
    default: "General"
  },
  dailyIncome: {
    type: Number,
    required: true,
    min: 0
  },
  platform: {
    type: String,
    required: true,
    enum: ["Zomato", "Swiggy", "Zepto", "Blinkit", "Amazon", "Flipkart", "Dunzo", "Uber Eats", "Other"]
  },
  vehicleType: {
    type: String,
    enum: ["Bicycle", "Bike", "Scooter", "Auto", "Car", "On Foot", "Other"],
    default: "Bike"
  },
  workingHours: {
    type: Number,
    default: 8,
    min: 1,
    max: 18
  },
  experienceMonths: {
    type: Number,
    default: 0,
    min: 0
  },

  // AI-computed fields
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