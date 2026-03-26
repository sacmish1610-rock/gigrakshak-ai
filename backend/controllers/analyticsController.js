const User = require("../models/User");
const Policy = require("../models/Policy");
const Claim = require("../models/Claim");
const TriggerLog = require("../models/TriggerLog");

/**
 * 📊 Dashboard Analytics
 * GET /api/analytics/dashboard
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activePolicies = await Policy.countDocuments({ status: "active" });
    const totalPolicies = await Policy.countDocuments();
    const totalClaims = await Claim.countDocuments();
    const approvedClaims = await Claim.countDocuments({ status: "APPROVED" });

    // Total payouts
    const payoutResult = await Claim.aggregate([
      { $match: { status: "APPROVED" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalPayouts = payoutResult.length > 0 ? payoutResult[0].total : 0;

    // Average risk score from recent users
    const avgRiskResult = await User.aggregate([
      { $group: { _id: null, avgRisk: { $avg: "$riskScore" } } }
    ]);
    const avgRiskScore = avgRiskResult.length > 0 ? parseFloat(avgRiskResult[0].avgRisk.toFixed(3)) : 0;

    // Revenue (total premiums collected)
    const premiumResult = await Policy.aggregate([
      { $group: { _id: null, total: { $sum: "$weeklyPremium" } } }
    ]);
    const totalPremiums = premiumResult.length > 0 ? premiumResult[0].total : 0;

    // Loss ratio
    const lossRatio = totalPremiums > 0 ? parseFloat((totalPayouts / totalPremiums * 100).toFixed(1)) : 0;

    // Claims by trigger type
    const triggerDistribution = await Claim.aggregate([
      { $group: { _id: "$triggerType", count: { $sum: 1 }, totalPaid: { $sum: "$amount" } } },
      { $sort: { count: -1 } }
    ]);

    // Plan distribution
    const planDistribution = await Policy.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$planType", count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activePolicies,
        totalPolicies,
        totalClaims,
        approvedClaims,
        totalPayouts,
        totalPremiums,
        lossRatio,
        avgRiskScore,
        claimSuccessRate: totalClaims > 0 ? Math.round((approvedClaims / totalClaims) * 100) : 0,
        triggerDistribution,
        planDistribution
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "❌ Error fetching analytics",
      success: false,
      error: error.message
    });
  }
};

/**
 * 📈 Trigger Statistics
 * GET /api/analytics/triggers
 */
exports.getTriggerStats = async (req, res) => {
  try {
    const totalTriggers = await TriggerLog.countDocuments();
    const activatedTriggers = await TriggerLog.countDocuments({ triggered: true });

    const typeDistribution = await TriggerLog.aggregate([
      { $match: { triggered: true } },
      { $group: { _id: "$triggerType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const severityDistribution = await TriggerLog.aggregate([
      { $match: { triggered: true } },
      { $group: { _id: "$severity", count: { $sum: 1 } } }
    ]);

    // Recent triggers (last 7 days)
    const recentTriggers = await TriggerLog.find({ triggered: true })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      stats: {
        totalChecks: totalTriggers,
        activated: activatedTriggers,
        activationRate: totalTriggers > 0 ? parseFloat((activatedTriggers / totalTriggers * 100).toFixed(1)) : 0,
        typeDistribution,
        severityDistribution,
        recentTriggers
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "❌ Error fetching trigger stats",
      success: false,
      error: error.message
    });
  }
};
