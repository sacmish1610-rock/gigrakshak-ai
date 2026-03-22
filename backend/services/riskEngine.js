// 🔥 AI Risk Engine (Core Brain of System)

const calculateRisk = ({ rain, aqi, orderDrop, peakHours }) => {

  // 🧠 Weighted ML-like formula
  let riskScore =
    (rain * 0.3) +
    (aqi * 0.2) +
    (orderDrop * 0.4) +
    (peakHours ? 10 : 0);

  // 🎯 Risk Level Classification
  let level = "LOW";

  if (riskScore > 70) {
    level = "HIGH";
  } else if (riskScore > 40) {
    level = "MEDIUM";
  }

  // 💡 AI Recommendation (WOW FEATURE 🔥)
  let recommendation = "Basic";

  if (level === "HIGH") {
    recommendation = "Pro";
  } else if (level === "MEDIUM") {
    recommendation = "Standard";
  }

  return {
    riskScore: Math.round(riskScore),
    level,
    recommendation
  };
};

module.exports = calculateRisk;