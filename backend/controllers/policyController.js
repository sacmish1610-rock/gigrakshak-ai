const Policy = require("../models/Policy");

// 🔥 Buy Policy
exports.buyPolicy = async (req, res) => {
  try {
    const { userId, planType, premium } = req.body;

    // 🎯 Coverage decide karo
    let coverage = 500;

    if (planType === "Standard") coverage = 1000;
    if (planType === "Pro") coverage = 2000;

    // 🗓️ 1 week validity
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 7);

    const policy = new Policy({
      userId,
      planType,
      premium,
      coverage,
      startDate,
      endDate
    });

    await policy.save();

    res.status(201).json({
      message: "Policy purchased successfully 💼",
      policy
    });

  } catch (error) {
    res.status(500).json({
      message: "Error buying policy",
      error: error.message
    });
  }
};