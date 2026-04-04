// 💸 Dynamic Weekly Pricing Engine v2.0

/**
 * Plan definitions with weekly pricing
 */
const PLANS = {
  Basic: {
    baseWeeklyPremium: 49,
    coverage: 2500,
    incomeProtectionPercent: 50,
    features: [
      "50% income protection",
      "7-day active coverage",
      "Weather monitoring",
      "Email support"
    ]
  },
  Standard: {
    baseWeeklyPremium: 99,
    coverage: 5000,
    incomeProtectionPercent: 60,
    features: [
      "60% income protection",
      "7-day active coverage",
      "Real-time weather alerts",
      "Priority support",
      "Auto-claim enabled",
      "AQI monitoring"
    ]
  },
  Pro: {
    baseWeeklyPremium: 199,
    coverage: 10000,
    incomeProtectionPercent: 80,
    features: [
      "80% income protection",
      "7-day active coverage",
      "24/7 premium support",
      "Instant auto-claim",
      "Weather + AQI + Heat alerts",
      "Weekly analytics reports",
      "Social disruption coverage"
    ]
  }
};

/**
 * Calculate dynamic weekly premium based on risk factors
 * 
 * @param {Object} params
 * @param {number} params.riskScore - AI risk score (0-1)
 * @param {string} params.level - Risk level (LOW, MEDIUM, HIGH)
 * @param {string} params.planType - Selected plan (Basic, Standard, Pro)
 * @param {number} params.dailyIncome - Worker's daily income
 * @param {number} params.experienceMonths - Worker experience
 * @param {string} params.zone - Work zone
 * @returns {Object} Pricing result with all 3 plans
 */
const calculatePremium = ({ riskScore = 0.3, level = "LOW", planType, dailyIncome = 500, experienceMonths = 6, zone = "General" }) => {
  // Calculate premium for a specific plan or all plans
  const calculateForPlan = (plan, planName) => {
    let premium = plan.baseWeeklyPremium;

    // 🧠 Risk-based adjustment (±30% of base)
    if (level === "HIGH") {
      premium = Math.round(premium * 1.3);
    } else if (level === "MEDIUM") {
      premium = Math.round(premium * 1.15);
    } else {
      premium = Math.round(premium * 0.95); // 5% discount for low risk
    }

    // 📊 Fine-tune with exact risk score
    const riskAdjustment = Math.round(riskScore * 10);
    premium += riskAdjustment;

    // 👤 Experience discount
    if (experienceMonths > 24) {
      premium = Math.round(premium * 0.90); // 10% discount
    } else if (experienceMonths > 12) {
      premium = Math.round(premium * 0.95); // 5% discount
    }

    // 📍 Zone adjustment & Hyper-local Risk Factors (AI Model)
    const highRiskZones = ["Mumbai", "Chennai", "Kolkata", "Delhi"];
    if (highRiskZones.includes(zone)) {
      premium = Math.round(premium * 1.1); // 10% surcharge for historically high-risk cities
    }

    // 🏆 AI Integration Example 1: Historical Water Logging Safety
    // Machine Learning prediction: Charges ₹2 less per week if the worker operates 
    // in a micro-zone historically safe from water logging.
    let isWaterLoggingSafe = !highRiskZones.includes(zone) && riskScore < 0.4;
    if (isWaterLoggingSafe) {
      premium -= 2; 
    }

    // 🏆 AI Integration Example 2: Predictive Weather Modeling
    // Dynamically offers increased coverage hours or additional cover based on predictive modeling
    let extraCoverageAmount = 0;
    let extraCoverageHours = 0;
    if (riskScore > 0.6) {
      // If predictive weather predicts extreme conditions later in the week, automatically boost coverage
      extraCoverageAmount = 500;
      extraCoverageHours = 4; // Extend coverage for 4 extra hours of night shifts
    }

    // 🎯 Cap limits
    const minPremiums = { Basic: 29, Standard: 69, Pro: 149 };
    const maxPremiums = { Basic: 99, Standard: 199, Pro: 399 };
    premium = Math.max(minPremiums[planName], Math.min(maxPremiums[planName], premium));

    // Calculate weekly coverage based on income
    const weeklyIncome = dailyIncome * 7;
    const effectiveCoverage = Math.min(
      Math.round(weeklyIncome * (plan.incomeProtectionPercent / 100)),
      plan.coverage
    );

    return {
      planName,
      weeklyPremium: premium,
      dailyEquivalent: parseFloat((premium / 7).toFixed(1)),
      coverage: plan.coverage + extraCoverageAmount,
      baseCoverage: plan.coverage,
      effectiveCoverage,
      incomeProtectionPercent: plan.incomeProtectionPercent,
      features: plan.features,
      savingsPercentage: parseFloat(((premium / weeklyIncome) * 100).toFixed(1)),
      valueRatio: parseFloat((effectiveCoverage / premium).toFixed(1)),
      aiAdjustments: {
        isWaterLoggingSafe,
        waterLoggingDiscount: isWaterLoggingSafe ? 2 : 0,
        extraCoverageHours,
        extraCoverageAmount
      }
    };
  };

  // If specific plan requested, return that plan's pricing
  if (planType && PLANS[planType]) {
    const result = calculateForPlan(PLANS[planType], planType);
    return {
      selectedPlan: result,
      message: `AI-adjusted weekly premium for ${planType} plan based on risk level (${level})`,
      riskLevel: level,
      riskScore
    };
  }

  // Otherwise return all plan options
  const allPlans = {};
  for (const [name, plan] of Object.entries(PLANS)) {
    allPlans[name] = calculateForPlan(plan, name);
  }

  return {
    plans: allPlans,
    recommended: level === "HIGH" ? "Pro" : level === "MEDIUM" ? "Standard" : "Basic",
    message: `AI-adjusted weekly premiums based on risk level (${level})`,
    riskLevel: level,
    riskScore
  };
};

/**
 * Get plan details by name
 */
const getPlanDetails = (planName) => {
  return PLANS[planName] || null;
};

module.exports = { calculatePremium, getPlanDetails, PLANS };