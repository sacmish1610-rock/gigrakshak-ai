const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  planType: {
    type: String,
    enum: ["Basic", "Standard", "Pro"],
    required: true
  },
  premium: {
    type: Number,
    required: true
  },
  coverage: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("Policy", policySchema);