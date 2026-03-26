const checkTriggers = require("../services/triggerEngine");
const { getWeatherData, getAQI, simulateOrderDrop, simulateSocialDisruption } = require("../utils/weather");
const TriggerLog = require("../models/TriggerLog");

/**
 * 🚨 Legacy Trigger Check (kept for backward compatibility)
 * POST /api/trigger
 */
exports.runTrigger = (req, res) => {
  try {
    const { rain, aqi, orderDrop, temperature, social, riskScore } = req.body;

    const result = checkTriggers({
      rain: rain || 0,
      aqi: aqi || 0,
      orderDrop: orderDrop || 0,
      temperature: temperature || 30,
      social: social || false,
      riskScore: riskScore || 0
    });

    res.json({
      message: result.triggered ? "🚨 TRIGGER ACTIVATED" : "✅ No trigger",
      success: true,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      message: "❌ Error in trigger engine",
      success: false,
      error: error.message
    });
  }
};

/**
 * 🚨 Smart Trigger Check v2.0
 * POST /api/trigger/check
 */
exports.checkTrigger = async (req, res) => {
  try {
    const { location, userId, policyId, income, rain, aqi, orderDrop, temperature, social, riskScore } = req.body;

    // Build trigger data
    let triggerData = {
      rain: rain || 0,
      aqi: aqi || 0,
      orderDrop: orderDrop || 0,
      temperature: temperature || 30,
      social: social || false,
      riskScore: riskScore || 0
    };

    // If location provided, fetch real weather
    if (location && !rain) {
      const weatherData = await getWeatherData(location);
      const weatherAQI = await getAQI(location, weatherData.rainInLastHour);
      const weatherOrderDrop = simulateOrderDrop(weatherData.weather, weatherAQI, weatherData.temperature);

      triggerData = {
        rain: weatherData.rainInLastHour,
        aqi: weatherAQI,
        orderDrop: weatherOrderDrop,
        temperature: weatherData.temperature,
        social: social || false,
        riskScore: riskScore || 0
      };
    }

    // Check all 5 triggers
    const result = checkTriggers(triggerData);

    // Log trigger event
    if (userId) {
      try {
        const triggerLog = new TriggerLog({
          userId,
          policyId: policyId || undefined,
          triggerType: result.primaryTrigger ? result.primaryTrigger.triggerType : "severe_order_drop",
          triggered: result.triggered,
          reason: result.primaryTrigger ? result.primaryTrigger.reason : "No trigger conditions met",
          severity: result.primaryTrigger ? result.primaryTrigger.severity : "LOW",
          conditions: triggerData,
          location: location || "Unknown"
        });
        await triggerLog.save();
      } catch (logError) {
        console.error("Trigger log error:", logError.message);
      }
    }

    return res.status(200).json({
      message: result.triggered ? "🚨 TRIGGER ACTIVATED" : "✅ No trigger conditions met",
      success: true,
      data: {
        triggered: result.triggered,
        triggerCount: result.triggerCount,
        primaryTrigger: result.primaryTrigger,
        allTriggers: result.allTriggers,
        conditions: result.conditions,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Trigger check error:", error);
    return res.status(500).json({
      message: "❌ Error checking trigger",
      success: false,
      error: error.message
    });
  }
};

/**
 * 🌧️ Simulate specific disruption scenario
 * POST /api/trigger/simulate
 */
exports.simulateDisruption = async (req, res) => {
  try {
    const { type, location, userId } = req.body;

    let scenario = {};
    const weatherData = location ? await getWeatherData(location) : null;

    switch (type) {
      case "rain":
        scenario = {
          rain: 12 + Math.random() * 10,
          temperature: weatherData ? weatherData.temperature : 28,
          aqi: 80,
          orderDrop: 45 + Math.random() * 30,
          social: false,
          description: "Heavy rainfall simulation"
        };
        break;
      case "heat":
        scenario = {
          rain: 0,
          temperature: 43 + Math.random() * 5,
          aqi: 150 + Math.random() * 100,
          orderDrop: 30 + Math.random() * 35,
          social: false,
          description: "Extreme heat wave simulation"
        };
        break;
      case "aqi":
        scenario = {
          rain: 0,
          temperature: weatherData ? weatherData.temperature : 32,
          aqi: 250 + Math.random() * 150,
          orderDrop: 25 + Math.random() * 40,
          social: false,
          description: "Severe air pollution simulation"
        };
        break;
      case "social":
        const socialEvent = simulateSocialDisruption();
        scenario = {
          rain: 0,
          temperature: weatherData ? weatherData.temperature : 30,
          aqi: 100,
          orderDrop: socialEvent.orderDrop,
          social: true,
          description: socialEvent.description,
          socialType: socialEvent.type,
          socialSeverity: socialEvent.severity
        };
        break;
      case "orderdrop":
        scenario = {
          rain: Math.random() * 5,
          temperature: weatherData ? weatherData.temperature : 30,
          aqi: 100 + Math.random() * 50,
          orderDrop: 65 + Math.random() * 25,
          social: false,
          description: "Severe order drop simulation"
        };
        break;
      default:
        return res.status(400).json({
          message: "❌ Invalid simulation type. Use: rain, heat, aqi, social, orderdrop",
          success: false
        });
    }

    // Run trigger check on simulated data
    const result = checkTriggers(scenario);

    return res.json({
      message: `🧪 ${scenario.description}`,
      success: true,
      data: {
        scenario,
        triggerResult: result,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "❌ Error simulating disruption",
      success: false,
      error: error.message
    });
  }
};
