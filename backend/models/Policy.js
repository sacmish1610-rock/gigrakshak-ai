const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  policyNumber: {
    type: String,
    unique: true
  },
  planType: {
    type: String,
    enum: ["Basic", "Standard", "Pro"],
    required: true
  },
  weeklyPremium: {
    type: Number,
    required: true
  },
  coverage: {
    type: Number,
    required: true
  },
  incomeProtectionPercent: {
    type: Number,
    default: 50
  },
  status: {
    type: String,
    enum: ["active", "expired", "cancelled", "pending"],
    default: "active"
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  riskScoreAtPurchase: {
    type: Number,
    default: 0
  },
  riskLevelAtPurchase: {
    type: String,
    default: "LOW"
  },
  claimsCount: {
    type: Number,
    default: 0
  },
  totalClaimsPaid: {
    type: Number,
    default: 0
  },
  // Features enabled for this plan
  features: [{
    type: String
  }]
}, { timestamps: true });

// Auto-generate policy number before save
policySchema.pre("save", function (next) {
  if (!this.policyNumber) {
    const prefix = this.planType === "Pro" ? "PRO" : this.planType === "Standard" ? "STD" : "BSC";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.policyNumber = `GR-${prefix}-${timestamp}-${random}`;
  }
  next();
});

// Auto-set endDate (7 days from start)
policySchema.pre("save", function (next) {
  if (!this.endDate && this.startDate) {
    const end = new Date(this.startDate);
    end.setDate(end.getDate() + 7);
    this.endDate = end;
  }
  next();
});

module.exports = mongoose.model("Policy", policySchema);