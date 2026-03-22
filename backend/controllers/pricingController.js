const calculatePremium = require("../services/pricingEngine");

// 💸 Pricing API
exports.getPremium = (req, res) => {
  try {
    const { riskScore, level } = req.body;

    const result = calculatePremium({ riskScore, level });

    res.json({
      message: "Premium calculated successfully 💸",
      data: result
    });

  } catch (error) {
    res.status(500).json({
      message: "Error calculating premium",
      error: error.message
    });
  }
};