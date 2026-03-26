const { calculatePremium, PLANS } = require("../services/pricingEngine");

/**
 * 💸 Get Weekly Premium — All Plans or Specific Plan
 * POST /api/pricing
 */
exports.getPremium = (req, res) => {
  try {
    const { riskScore, level, planType, dailyIncome, experienceMonths, zone } = req.body;

    const result = calculatePremium({
      riskScore: riskScore || 0.3,
      level: level || "LOW",
      planType,
      dailyIncome: dailyIncome || 500,
      experienceMonths: experienceMonths || 6,
      zone: zone || "General"
    });

    res.json({
      message: "✅ Weekly premium calculated",
      success: true,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      message: "❌ Error calculating premium",
      success: false,
      error: error.message
    });
  }
};

/**
 * 📋 Get all plan definitions
 * GET /api/pricing/plans
 */
exports.getPlans = (req, res) => {
  try {
    const plans = Object.entries(PLANS).map(([name, plan]) => ({
      name,
      ...plan
    }));

    res.json({
      success: true,
      plans
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Error fetching plans",
      success: false,
      error: error.message
    });
  }
};