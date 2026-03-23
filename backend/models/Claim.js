const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  reason: {
    type: String
  },
  fraudScore: {
    type: String,
    default: "LOW"
  },
  status: {
    type: String,
    default: "APPROVED"
  }
}, { timestamps: true });

module.exports = mongoose.model("Claim", claimSchema);