const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 6
  },
  city: {
    type: String,
    trim: true,
    default: ""
  },
  state: {
    type: String,
    trim: true,
    default: ""
  },
  workType: {
    type: String,
    required: true,
    enum: ["Zomato", "Swiggy", "Zepto", "Blinkit", "Amazon", "Flipkart", "Dunzo", "Uber Eats", "Other"]
  },
  vehicleType: {
    type: String,
    enum: ["Bicycle", "Bike", "Scooter", "Auto", "Car", "On Foot", "Other"],
    default: "Bike"
  },
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  income: {
    type: Number,
    required: true,
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