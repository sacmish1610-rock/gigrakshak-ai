const calculateRisk = require("../services/riskEngine");
const { getWeatherData, getAQI, simulateOrderDrop, getHeatIndex } = require("../utils/weather");

/**
 * 🚀 Real-Time Risk Calculation API v2.0
 * POST /api/risk
 */
exports.getRisk = async (req, res) => {
  try {
    const { location, income, zone, experienceMonths } = req.body;

    if (!location || !income) {
      return res.status(400).json({
        message: "❌ Location and income are required",
        success: false
      });
    }

    if (isNaN(income) || income <= 0) {
      return res.status(400).json({
        message: "❌ Income must be a valid positive number",
        success: false
      });
    }

    // 🌤️ Fetch real-time weather data
    const weatherData = await getWeatherData(location);

    // 🌫️ Get AQI
    const aqi = await getAQI(location, weatherData.rainInLastHour);

    // 📉 Simulate order drop
    const orderDrop = simulateOrderDrop(weatherData.weather, aqi, weatherData.temperature);

    // 🌡️ Get heat index
    const heatIndex = getHeatIndex(weatherData.temperature);

    // 💨 Normalize rain
    const rainNormalized = Math.min(weatherData.rainInLastHour, 20);

    // Determine if peak hours (11 AM - 2 PM, 7 PM - 10 PM IST)
    const currentHour = new Date().getHours();
    const isPeakHour = (currentHour >= 11 && currentHour <= 14) || (currentHour >= 19 && currentHour <= 22);

    // 🎯 Calculate risk using enhanced formula
    const riskResult = calculateRisk({
      rain: rainNormalized,
      aqi: aqi,
      orderDrop: orderDrop,
      temperature: weatherData.temperature,
      zone: zone || location,
      experienceMonths: experienceMonths || 6,
      peakHours: isPeakHour,
      socialDisruption: false
    });

    // 📋 Recommend plan
    const planRecommendation = getPlanRecommendation(riskResult.level);

    // 💰 Calculate estimated losses
    const estimatedDailyLoss = Math.round((income * orderDrop) / 100);
    const estimatedWeeklyLoss = estimatedDailyLoss * 7;

    return res.status(200).json({
      message: "✅ Risk calculated successfully",
      success: true,
      data: {
        riskScore: riskResult.riskScore,
        riskLevel: riskResult.level,
        premiumMultiplier: riskResult.premiumMultiplier,
        planRecommendation,

        weather: {
          city: weatherData.city,
          condition: weatherData.weather,
          description: weatherData.description,
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          feelsLike: weatherData.feelsLike,
          windSpeed: weatherData.windSpeed,
          rainInLastHour: weatherData.rainInLastHour,
          tempMin: weatherData.tempMin,
          tempMax: weatherData.tempMax
        },

        heatIndex,
        aqi: aqi,
        aqiLevel: getAQILevel(aqi),

        orderDrop: Math.round(orderDrop),
        estimatedDailyLoss,
        estimatedWeeklyLoss,

        dailyIncome: income,
        weeklyIncome: income * 7,
        adjustedRiskScore: riskResult.riskScore,
        isPeakHour,

        breakdown: {
          rainImpact: riskResult.factors.rainContribution,
          aqiImpact: riskResult.factors.aqiContribution,
          orderDropImpact: riskResult.factors.orderDropContribution,
          heatImpact: riskResult.factors.heatContribution,
          zoneImpact: riskResult.factors.zoneContribution,
          totalFactors: {
            rain: rainNormalized,
            aqi: aqi,
            orderDrop: orderDrop,
            temperature: weatherData.temperature,
            zone: zone || location
          }
        },

        factors: riskResult.factors,
        rawFactors: riskResult.rawFactors,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Risk calculation error:", error.message);
    return res.status(500).json({
      message: "❌ Error calculating risk",
      success: false,
      error: error.message
    });
  }
};

/**
 * Get plan recommendation based on risk level
 */
const getPlanRecommendation = (riskLevel) => {
  const plans = {
    LOW: {
      name: "Basic",
      description: "Perfect for low-risk conditions",
      coverage: 2500,
      weeklyPremium: 49,
      incomeProtection: 50,
      features: [
        "50% income protection",
        "7-day coverage",
        "Weather monitoring",
        "Email support"
      ]
    },
    MEDIUM: {
      name: "Standard",
      description: "Recommended for moderate conditions",
      coverage: 5000,
      weeklyPremium: 99,
      incomeProtection: 60,
      features: [
        "60% income protection",
        "7-day coverage",
        "Real-time weather alerts",
        "Priority support",
        "Auto-claim enabled",
        "AQI monitoring"
      ]
    },
    HIGH: {
      name: "Pro",
      description: "Maximum protection for high-risk conditions",
      coverage: 10000,
      weeklyPremium: 199,
      incomeProtection: 80,
      features: [
        "80% income protection",
        "7-day coverage",
        "24/7 premium support",
        "Instant auto-claim",
        "Weather + AQI + Heat alerts",
        "Weekly analytics reports"
      ]
    }
  };

  return plans[riskLevel] || plans.LOW;
};

/**
 * Get AQI level description
 */
const getAQILevel = (aqi) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};
