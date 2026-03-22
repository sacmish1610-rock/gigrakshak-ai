const checkTrigger = require("../services/triggerEngine");

// 🚨 Trigger API
exports.runTrigger = (req, res) => {
  try {
    const { rain, aqi, orderDrop, peakHours, social } = req.body;

    const result = checkTrigger({
      rain,
      aqi,
      orderDrop,
      peakHours,
      social
    });

    res.json({
      message: "Trigger checked ⚡",
      data: result
    });

  } catch (error) {
    res.status(500).json({
      message: "Error in trigger engine",
      error: error.message
    });
  }
};