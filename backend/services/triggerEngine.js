// 🚨 Parametric Trigger Engine v2.0 — 5 Distinct Triggers

/**
 * Check all 5 parametric trigger conditions
 * 
 * Triggers:
 * 1. Heavy Rain: rain > 5mm AND orderDrop > 30%
 * 2. Extreme Heat: temp > 42°C AND orderDrop > 25%
 * 3. Poor AQI: aqi > 200 AND orderDrop > 20%
 * 4. Social Disruption: social flag AND orderDrop > 15%
 * 5. Severe Order Drop: orderDrop > 60% (any cause)
 * 
 * @param {Object} params
 * @param {number} params.rain - Rainfall in mm/hr
 * @param {number} params.aqi - Air Quality Index
 * @param {number} params.orderDrop - Order drop percentage (0-100)
 * @param {number} params.temperature - Temperature in °C
 * @param {boolean} params.social - Social disruption flag
 * @param {number} params.riskScore - Current risk score
 * @returns {Object} Trigger result with type, reason, severity, payoutPercentage
 */
const checkTriggers = ({ rain = 0, aqi = 0, orderDrop = 0, temperature = 30, social = false, riskScore = 0 }) => {
  const triggeredEvents = [];

  // 🌧️ Trigger 1: Heavy Rain
  if (rain > 5 && orderDrop > 30) {
    let severity = "MEDIUM";
    let payoutPercent = 50;

    if (rain > 15 && orderDrop > 60) {
      severity = "CRITICAL";
      payoutPercent = 80;
    } else if (rain > 10 && orderDrop > 45) {
      severity = "HIGH";
      payoutPercent = 65;
    }

    triggeredEvents.push({
      triggerType: "heavy_rain",
      reason: `Heavy rain (${rain.toFixed(1)}mm/hr) causing ${orderDrop.toFixed(0)}% order drop`,
      severity,
      payoutPercent,
      icon: "🌧️"
    });
  }

  // 🌡️ Trigger 2: Extreme Heat
  if (temperature > 42 && orderDrop > 25) {
    let severity = "MEDIUM";
    let payoutPercent = 45;

    if (temperature > 47) {
      severity = "CRITICAL";
      payoutPercent = 75;
    } else if (temperature > 44) {
      severity = "HIGH";
      payoutPercent = 60;
    }

    triggeredEvents.push({
      triggerType: "extreme_heat",
      reason: `Extreme heat (${temperature}°C) causing ${orderDrop.toFixed(0)}% order drop`,
      severity,
      payoutPercent,
      icon: "🔥"
    });
  }

  // 🌫️ Trigger 3: Poor AQI
  if (aqi > 200 && orderDrop > 20) {
    let severity = "MEDIUM";
    let payoutPercent = 40;

    if (aqi > 400) {
      severity = "CRITICAL";
      payoutPercent = 70;
    } else if (aqi > 300) {
      severity = "HIGH";
      payoutPercent = 55;
    }

    triggeredEvents.push({
      triggerType: "poor_aqi",
      reason: `Hazardous air quality (AQI: ${aqi}) causing ${orderDrop.toFixed(0)}% order drop`,
      severity,
      payoutPercent,
      icon: "🌫️"
    });
  }

  // 🚫 Trigger 4: Social Disruption
  if (social && orderDrop > 15) {
    let severity = "HIGH";
    let payoutPercent = 60;

    if (orderDrop > 70) {
      severity = "CRITICAL";
      payoutPercent = 80;
    }

    triggeredEvents.push({
      triggerType: "social_disruption",
      reason: `Social disruption (curfew/strike/closure) causing ${orderDrop.toFixed(0)}% order drop`,
      severity,
      payoutPercent,
      icon: "🚫"
    });
  }

  // 📉 Trigger 5: Severe Order Drop (any cause)
  if (orderDrop > 60 && triggeredEvents.length === 0) {
    let severity = "HIGH";
    let payoutPercent = 55;

    if (orderDrop > 85) {
      severity = "CRITICAL";
      payoutPercent = 75;
    }

    triggeredEvents.push({
      triggerType: "severe_order_drop",
      reason: `Severe order drop of ${orderDrop.toFixed(0)}% detected (cause unknown)`,
      severity,
      payoutPercent,
      icon: "📉"
    });
  }

  // Determine overall result
  const isTriggered = triggeredEvents.length > 0;

  // Use the highest severity trigger for primary response
  const primaryTrigger = triggeredEvents.sort((a, b) => {
    const severityOrder = { "CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1 };
    return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
  })[0] || null;

  return {
    triggered: isTriggered,
    triggerCount: triggeredEvents.length,
    primaryTrigger: primaryTrigger ? {
      triggerType: primaryTrigger.triggerType,
      reason: primaryTrigger.reason,
      severity: primaryTrigger.severity,
      payoutPercent: primaryTrigger.payoutPercent,
      icon: primaryTrigger.icon
    } : null,
    allTriggers: triggeredEvents,
    conditions: { rain, aqi, orderDrop, temperature, social, riskScore }
  };
};

module.exports = checkTriggers;