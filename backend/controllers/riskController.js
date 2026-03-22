const calculateRisk = require("../services/riskEngine");

// 🔥 Risk Calculation API
exports.getRisk = (req, res) => {
  try {
    const { rain, aqi, orderDrop, peakHours } = req.body;

    const result = calculateRisk({
      rain,
      aqi,
      orderDrop,
      peakHours
    });

    res.json({
      message: "Risk calculated successfully 🚀",
      data: result
    });

  } catch (error) {
    res.status(500).json({
      message: "Error calculating risk",
      error: error.message
    });
  }
};