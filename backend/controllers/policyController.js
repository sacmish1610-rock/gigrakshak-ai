const Policy = require("../models/Policy");
const mongoose = require("mongoose");
const { getPlanDetails } = require("../services/pricingEngine");

/**
 * 🔥 Buy Policy — Weekly Insurance Purchase
 * POST /api/policy/buy
 */
exports.buyPolicy = async (req, res) => {
  try {
    const { userId, planType, weeklyPremium, riskScore, riskLevel } = req.body;

    if (!planType) {
      return res.status(400).json({
        message: "❌ planType is required",
        success: false
      });
    }

    // Validate userId is a valid MongoDB ObjectId (if provided)
    let validUserId = null;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      validUserId = userId;
    }

    // Get plan details
    const planDetails = getPlanDetails(planType);
    if (!planDetails) {
      return res.status(400).json({
        message: "❌ Invalid plan type. Choose Basic, Standard, or Pro",
        success: false
      });
    }

    // Check for existing active policy (only if we have a valid userId)
    if (validUserId) {
      const existingPolicy = await Policy.findOne({ userId: validUserId, status: "active" });
      if (existingPolicy) {
        existingPolicy.status = "expired";
        await existingPolicy.save();
      }
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 7);

    const policy = new Policy({
      userId: validUserId || new mongoose.Types.ObjectId(),
      planType,
      weeklyPremium: weeklyPremium || planDetails.baseWeeklyPremium,
      coverage: planDetails.coverage,
      incomeProtectionPercent: planDetails.incomeProtectionPercent,
      status: "active",
      startDate,
      endDate,
      riskScoreAtPurchase: riskScore || 0,
      riskLevelAtPurchase: riskLevel || "LOW",
      features: planDetails.features
    });

    await policy.save();

    res.status(201).json({
      message: "✅ Policy purchased successfully",
      success: true,
      policy: {
        _id: policy._id,
        policyNumber: policy.policyNumber,
        planType: policy.planType,
        weeklyPremium: policy.weeklyPremium,
        coverage: policy.coverage,
        incomeProtectionPercent: policy.incomeProtectionPercent,
        status: policy.status,
        startDate: policy.startDate,
        endDate: policy.endDate,
        features: policy.features,
        daysRemaining: 7
      }
    });

  } catch (error) {
    console.error("❌ Buy policy error:", error);
    res.status(500).json({
      message: "❌ Error buying policy",
      success: false,
      error: error.message
    });
  }
};

/**
 * 📋 Get User's Policies
 * GET /api/policy/user/:userId
 */
exports.getUserPolicies = async (req, res) => {
  try {
    const policies = await Policy.find({ userId: req.params.userId }).sort({ createdAt: -1 });

    // Auto-expire old policies
    const now = new Date();
    for (let policy of policies) {
      if (policy.status === "active" && policy.endDate < now) {
        policy.status = "expired";
        await policy.save();
      }
    }

    const activePolicy = policies.find(p => p.status === "active");
    const daysRemaining = activePolicy
      ? Math.max(0, Math.ceil((activePolicy.endDate - now) / (1000 * 60 * 60 * 24)))
      : 0;

    res.json({
      success: true,
      activePolicy: activePolicy ? {
        ...activePolicy.toObject(),
        daysRemaining
      } : null,
      totalPolicies: policies.length,
      policies
    });

  } catch (error) {
    res.status(500).json({
      message: "❌ Error fetching policies",
      success: false,
      error: error.message
    });
  }
};

/**
 * 🔍 Get Single Policy Details
 * GET /api/policy/:id
 */
exports.getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id).populate("userId", "name location platform");
    if (!policy) {
      return res.status(404).json({ message: "❌ Policy not found", success: false });
    }

    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((policy.endDate - now) / (1000 * 60 * 60 * 24)));

    res.json({
      success: true,
      policy: { ...policy.toObject(), daysRemaining }
    });

  } catch (error) {
    res.status(500).json({
      message: "❌ Error fetching policy",
      success: false,
      error: error.message
    });
  }
};

/**
 * 🔄 Renew Policy
 * POST /api/policy/renew/:id
 */
exports.renewPolicy = async (req, res) => {
  try {
    const oldPolicy = await Policy.findById(req.params.id);
    if (!oldPolicy) {
      return res.status(404).json({ message: "❌ Policy not found", success: false });
    }

    // Expire old policy
    oldPolicy.status = "expired";
    await oldPolicy.save();

    // Create new policy with same plan
    const planDetails = getPlanDetails(oldPolicy.planType);
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 7);

    const newPolicy = new Policy({
      userId: oldPolicy.userId,
      planType: oldPolicy.planType,
      weeklyPremium: oldPolicy.weeklyPremium,
      coverage: oldPolicy.coverage,
      incomeProtectionPercent: oldPolicy.incomeProtectionPercent,
      status: "active",
      startDate,
      endDate,
      riskScoreAtPurchase: oldPolicy.riskScoreAtPurchase,
      riskLevelAtPurchase: oldPolicy.riskLevelAtPurchase,
      features: planDetails ? planDetails.features : oldPolicy.features
    });

    await newPolicy.save();

    res.status(201).json({
      message: "✅ Policy renewed successfully",
      success: true,
      policy: { ...newPolicy.toObject(), daysRemaining: 7 }
    });

  } catch (error) {
    res.status(500).json({
      message: "❌ Error renewing policy",
      success: false,
      error: error.message
    });
  }
};

/**
 * ❌ Cancel Policy
 * PUT /api/policy/cancel/:id
 */
exports.cancelPolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: "❌ Policy not found", success: false });
    }

    if (policy.status !== "active") {
      return res.status(400).json({ message: "❌ Policy is not active", success: false });
    }

    policy.status = "cancelled";
    await policy.save();

    res.json({
      message: "✅ Policy cancelled",
      success: true,
      policy
    });

  } catch (error) {
    res.status(500).json({
      message: "❌ Error cancelling policy",
      success: false,
      error: error.message
    });
  }
};