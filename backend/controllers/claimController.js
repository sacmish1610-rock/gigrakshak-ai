const Claim = require("../models/Claim");

// 💰 Auto Claim Processing
exports.createClaim = async (req, res) => {
  try {
    console.log("Incoming Claim Data:", req.body); // 🔥 DEBUG

    const { userId, amount, reason } = req.body;

    // ❗ validation check
    if (!userId || !amount || !reason) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // 🛡️ Basic Fraud Detection
    let fraudScore = "LOW";

    if (amount > 1500) fraudScore = "MEDIUM";
    if (amount > 2000) fraudScore = "HIGH";

    const claim = new Claim({
      userId,
      amount,
      reason,
      fraudScore,
      status: "APPROVED"
    });

    await claim.save();

    res.json({
      message: "Claim processed automatically 💰",
      claim
    });

  } catch (error) {
    console.log("ERROR:", error); // 🔥 VERY IMPORTANT
    res.status(500).json({
      message: "Error processing claim",
      error: error.message
    });
  }
};