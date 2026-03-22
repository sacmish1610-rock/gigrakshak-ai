// 💸 Dynamic Pricing Engine (ML-like logic)

const calculatePremium = ({ riskScore, level }) => {

  let basePrice = 20; // basic minimum price

  let premium = basePrice;

  // 🔥 Risk-based pricing
  if (level === "HIGH") {
    premium = 50;
  } else if (level === "MEDIUM") {
    premium = 30;
  } else {
    premium = 20;
  }

  // 🧠 ML-like adjustment (fine tuning)
  premium += Math.round(riskScore * 0.1);

  // 🎯 Cap limits (important for realism)
  if (premium > 60) premium = 60;
  if (premium < 15) premium = 15;

  return {
    premium,
    message: `AI adjusted your premium based on risk level (${level})`
  };
};

module.exports = calculatePremium;