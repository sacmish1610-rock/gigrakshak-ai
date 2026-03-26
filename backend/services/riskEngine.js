// 🔥 AI Risk Engine v2.0 — Enhanced with Heat, Zone, Experience factors

/**
 * Calculate comprehensive risk score based on multiple environmental and operational factors
 * 
 * Formula: riskScore = (rain × 0.25) + (aqiNorm × 0.20) + (orderDropNorm × 0.25) + (heatFactor × 0.15) + (zoneFactor × 0.15)
 * 
 * @param {Object} factors
 * @param {number} factors.rain - Rain in mm (0-20)
 * @param {number} factors.aqi - Air Quality Index (0-500)
 * @param {number} factors.orderDrop - Order drop percentage (0-100)
 * @param {number} factors.temperature - Current temperature in °C
 * @param {string} factors.zone - Worker zone for historical risk
 * @param {number} factors.experienceMonths - Worker experience in months
 * @param {boolean} factors.peakHours - Whether current time is peak hours
 * @param {boolean} factors.socialDisruption - Active social disruption flag
 * @returns {Object} Comprehensive risk result
 */
const calculateRisk = ({
  rain = 0,
  aqi = 50,
  orderDrop = 0,
  temperature = 30,
  zone = "General",
  experienceMonths = 6,
  peakHours = false,
  socialDisruption = false
}) => {
  // 🌧️ Rain factor (normalized 0-1, capped at 20mm)
  const rainNorm = Math.min(rain, 20) / 20;
  const rainContribution = rainNorm * 0.25;

  // 🌫️ AQI factor (normalized 0-1, scale of 500)
  const aqiNorm = Math.min(aqi, 500) / 500;
  const aqiContribution = aqiNorm * 0.20;

  // 📉 Order drop factor (normalized 0-1)
  const orderDropNorm = Math.min(orderDrop, 100) / 100;
  const orderDropContribution = orderDropNorm * 0.25;

  // 🌡️ Heat/Cold factor — extreme temps increase risk
  let heatFactor = 0;
  if (temperature > 42) {
    heatFactor = Math.min((temperature - 42) / 8, 1); // 42-50°C → 0-1
  } else if (temperature > 38) {
    heatFactor = (temperature - 38) / 8; // 38-42°C → 0-0.5
  } else if (temperature < 5) {
    heatFactor = Math.min((5 - temperature) / 10, 1); // Below 5°C
  } else if (temperature < 10) {
    heatFactor = (10 - temperature) / 10; // 5-10°C → 0-0.5
  }
  const heatContribution = heatFactor * 0.15;

  // 📍 Zone-based historical risk factor
  const zoneRiskMap = {
    "Mumbai": 0.8,       // High flood risk
    "Chennai": 0.75,     // Cyclone + flood risk
    "Kolkata": 0.7,      // Monsoon risk
    "Delhi": 0.65,       // Pollution + heat
    "Bangalore": 0.4,    // Moderate
    "Hyderabad": 0.5,    // Moderate heat
    "Pune": 0.45,        // Moderate
    "Ahmedabad": 0.6,    // Heat risk
    "Jaipur": 0.55,      // Heat + sandstorm
    "Lucknow": 0.5,      // Pollution
    "General": 0.3       // Default low
  };
  const zoneRisk = zoneRiskMap[zone] || zoneRiskMap["General"];
  const zoneContribution = zoneRisk * 0.15;

  // 🧠 Base risk score
  let riskScore = rainContribution + aqiContribution + orderDropContribution + heatContribution + zoneContribution;

  // ⚡ Peak hours multiplier (20% increase)
  if (peakHours) {
    riskScore *= 1.2;
  }

  // 🚨 Social disruption adds flat 0.15
  if (socialDisruption) {
    riskScore = Math.min(riskScore + 0.15, 1.0);
  }

  // 👤 Experience discount (experienced workers handle risk better)
  let experienceMultiplier = 1.0;
  if (experienceMonths > 24) {
    experienceMultiplier = 0.85; // 15% reduction
  } else if (experienceMonths > 12) {
    experienceMultiplier = 0.92; // 8% reduction
  } else if (experienceMonths > 6) {
    experienceMultiplier = 0.96; // 4% reduction
  }

  const adjustedRiskScore = riskScore * experienceMultiplier;

  // Clamp to 0-1
  const finalScore = parseFloat(Math.min(Math.max(adjustedRiskScore, 0), 1).toFixed(3));

  // 🎯 Risk Level Classification
  let level = "LOW";
  let recommendation = "Basic";
  if (finalScore > 0.6) {
    level = "HIGH";
    recommendation = "Pro";
  } else if (finalScore > 0.3) {
    level = "MEDIUM";
    recommendation = "Standard";
  }

  // 💡 Premium multiplier for dynamic pricing
  let premiumMultiplier = 1.0;
  if (level === "HIGH") {
    premiumMultiplier = 1.5;
  } else if (level === "MEDIUM") {
    premiumMultiplier = 1.2;
  }

  return {
    riskScore: finalScore,
    rawScore: parseFloat(riskScore.toFixed(3)),
    level,
    recommendation,
    premiumMultiplier,
    experienceMultiplier,
    factors: {
      rainContribution: parseFloat(rainContribution.toFixed(3)),
      aqiContribution: parseFloat(aqiContribution.toFixed(3)),
      orderDropContribution: parseFloat(orderDropContribution.toFixed(3)),
      heatContribution: parseFloat(heatContribution.toFixed(3)),
      zoneContribution: parseFloat(zoneContribution.toFixed(3))
    },
    rawFactors: {
      rain,
      aqi,
      orderDrop,
      temperature,
      heatFactor: parseFloat(heatFactor.toFixed(3)),
      zoneRisk: parseFloat(zoneRisk.toFixed(3))
    }
  };
};

module.exports = calculateRisk;