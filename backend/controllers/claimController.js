const Claim = require("../models/Claim");
const Policy = require("../models/Policy");

/**
 * 💰 Create Manual Claim
 * POST /api/claim
 */
exports.createClaim = async (req, res) => {
  try {
    const { userId, amount, reason } = req.body;

    if (!userId || !amount || !reason) {
      return res.status(400).json({
        message: "❌ All fields are required",
        success: false
      });
    }

    // Check for active policy
    const activePolicy = await Policy.findOne({ userId, status: "active" });

    // Fraud detection
    let fraudScore = "LOW";
    if (amount > 5000) fraudScore = "HIGH";
    else if (amount > 2500) fraudScore = "MEDIUM";

    // Check duplicate claims in last 24h
    const recentClaim = await Claim.findOne({
      userId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (recentClaim) {
      fraudScore = fraudScore === "LOW" ? "MEDIUM" : "HIGH";
    }

    const claim = new Claim({
      userId,
      policyId: activePolicy ? activePolicy._id : undefined,
      amount,
      reason,
      fraudScore,
      status: fraudScore === "HIGH" ? "PENDING" : "APPROVED",
      approvedAt: fraudScore !== "HIGH" ? new Date() : undefined
    });

    await claim.save();

    // Update policy claim count
    if (activePolicy) {
      activePolicy.claimsCount += 1;
      activePolicy.totalClaimsPaid += (claim.status === "APPROVED" ? amount : 0);
      await activePolicy.save();
    }

    res.json({
      message: claim.status === "APPROVED" ? "✅ Claim approved 💰" : "⏳ Claim under review",
      success: true,
      claim
    });

  } catch (error) {
    console.error("❌ Claim error:", error);
    res.status(500).json({
      message: "❌ Error processing claim",
      success: false,
      error: error.message
    });
  }
};

/**
 * 🤖 Auto-Claim Processing
 * POST /api/claim/auto
 */
exports.autoClaimProcessing = async (req, res) => {
  try {
    const startTime = Date.now();
    const { userId, income, triggerReason, triggerType, riskScore, severity, weatherSnapshot } = req.body;

    if (!userId || !income) {
      return res.status(400).json({
        message: "❌ Missing userId or income",
        success: false
      });
    }

    // Check for active policy
    const activePolicy = await Policy.findOne({ userId, status: "active" });

    // Calculate claim amount based on risk score and policy coverage
    let payoutPercent = 30; // default
    if (riskScore > 0.8) payoutPercent = 80;
    else if (riskScore > 0.6) payoutPercent = 60;
    else if (riskScore > 0.4) payoutPercent = 45;

    // If we have a policy, use its income protection percent
    if (activePolicy) {
      payoutPercent = Math.min(payoutPercent, activePolicy.incomeProtectionPercent);
    }

    const claimAmount = Math.round(income * (payoutPercent / 100));

    // Cap at policy coverage if policy exists
    const finalAmount = activePolicy
      ? Math.min(claimAmount, activePolicy.coverage - activePolicy.totalClaimsPaid)
      : claimAmount;

    if (finalAmount <= 0) {
      return res.status(400).json({
        message: "❌ Coverage limit reached for this week",
        success: false
      });
    }

    // Fraud detection
    let fraudScore = "LOW";

    // Check duplicate claims in last 6 hours
    const recentClaim = await Claim.findOne({
      userId,
      createdAt: { $gte: new Date(Date.now() - 6 * 60 * 60 * 1000) }
    });
    if (recentClaim) {
      fraudScore = "MEDIUM";
    }

    // Very frequent claims (>3 in 48h) = high fraud
    const recentClaimsCount = await Claim.countDocuments({
      userId,
      createdAt: { $gte: new Date(Date.now() - 48 * 60 * 60 * 1000) }
    });
    if (recentClaimsCount >= 3) {
      fraudScore = "HIGH";
    }

    const processingTime = Date.now() - startTime;

    const claim = new Claim({
      userId,
      policyId: activePolicy ? activePolicy._id : undefined,
      amount: finalAmount,
      reason: triggerReason || "Automatic parametric trigger-based claim",
      triggerType: triggerType || "other",
      severity: severity || "MEDIUM",
      fraudScore,
      status: fraudScore === "HIGH" ? "PENDING" : "APPROVED",
      weatherSnapshot: weatherSnapshot || {},
      payoutMethod: "UPI",
      processingTimeMs: processingTime,
      approvedAt: fraudScore !== "HIGH" ? new Date() : undefined,
      incomeAtClaim: income
    });

    await claim.save();

    // Update policy stats
    if (activePolicy && claim.status === "APPROVED") {
      activePolicy.claimsCount += 1;
      activePolicy.totalClaimsPaid += finalAmount;
      await activePolicy.save();
    }

    return res.status(201).json({
      message: claim.status === "APPROVED"
        ? "✅ Auto-claim approved instantly"
        : "⏳ Claim flagged for review",
      success: true,
      data: {
        claimId: claim._id,
        status: claim.status,
        amount: finalAmount,
        payoutPercent,
        reason: claim.reason,
        triggerType: claim.triggerType,
        severity: claim.severity,
        fraudScore: claim.fraudScore,
        processingTimeMs: processingTime,
        payoutMethod: "UPI",
        timestamp: new Date().toISOString(),
        notification: claim.status === "APPROVED"
          ? `💰 ₹${finalAmount} credited to your UPI!`
          : `⏳ ₹${finalAmount} claim under review`
      }
    });

  } catch (error) {
    console.error("❌ Auto-claim error:", error);
    return res.status(500).json({
      message: "❌ Error processing auto-claim",
      success: false,
      error: error.message
    });
  }
};

/**
 * 📜 Get Claim History
 * GET /api/claim/user/:userId
 */
exports.getClaimHistory = async (req, res) => {
  try {
    const claims = await Claim.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const totalPaid = claims
      .filter(c => c.status === "APPROVED")
      .reduce((sum, c) => sum + c.amount, 0);

    res.json({
      success: true,
      count: claims.length,
      totalPaid,
      claims
    });

  } catch (error) {
    res.status(500).json({
      message: "❌ Error fetching claims",
      success: false,
      error: error.message
    });
  }
};

/**
 * 📊 Get Claim Stats
 * GET /api/claim/stats/:userId
 */
exports.getClaimStats = async (req, res) => {
  try {
    const claims = await Claim.find({ userId: req.params.userId });

    const approved = claims.filter(c => c.status === "APPROVED");
    const pending = claims.filter(c => c.status === "PENDING");
    const rejected = claims.filter(c => c.status === "REJECTED");

    const totalPaid = approved.reduce((sum, c) => sum + c.amount, 0);
    const avgProcessingTime = approved.length > 0
      ? Math.round(approved.reduce((sum, c) => sum + (c.processingTimeMs || 0), 0) / approved.length)
      : 0;

    // Trigger type distribution
    const triggerDistribution = {};
    claims.forEach(c => {
      const type = c.triggerType || "other";
      triggerDistribution[type] = (triggerDistribution[type] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        totalClaims: claims.length,
        approved: approved.length,
        pending: pending.length,
        rejected: rejected.length,
        totalPaid,
        avgClaimAmount: approved.length > 0 ? Math.round(totalPaid / approved.length) : 0,
        avgProcessingTimeMs: avgProcessingTime,
        successRate: claims.length > 0 ? Math.round((approved.length / claims.length) * 100) : 0,
        triggerDistribution
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "❌ Error fetching claim stats",
      success: false,
      error: error.message
    });
  }
};
