const axios = require('axios');

/**
 * 🌤️ Weather Utility v2.0 — Real-time weather + heat index + social disruption simulation
 */

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'demo_key';

/**
 * Fetch weather data for a given city
 */
const getWeatherData = async (city) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    const { main, weather, wind, clouds, rain } = response.data;

    return {
      city: response.data.name,
      temperature: Math.round(main.temp),
      humidity: main.humidity,
      weather: weather[0].main,
      description: weather[0].description,
      windSpeed: wind.speed,
      cloudiness: clouds.all,
      rainInLastHour: rain ? (rain['1h'] || 0) : 0,
      pressure: main.pressure,
      feelsLike: Math.round(main.feels_like),
      tempMin: Math.round(main.temp_min),
      tempMax: Math.round(main.temp_max)
    };
  } catch (error) {
    console.error(`❌ Weather API Error for city "${city}":`, error.message);
    return generateMockWeatherData(city);
  }
};

/**
 * Generate mock weather data (fallback)
 */
const generateMockWeatherData = (city) => {
  const weatherConditions = ['Clear', 'Cloudy', 'Rain', 'Thunderstorm', 'Fog', 'Haze', 'Drizzle'];
  const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

  // City-specific temperature ranges
  const cityTemps = {
    'Mumbai': { min: 25, max: 38 },
    'Delhi': { min: 15, max: 48 },
    'Bangalore': { min: 18, max: 35 },
    'Chennai': { min: 24, max: 42 },
    'Kolkata': { min: 18, max: 40 },
    'Hyderabad': { min: 20, max: 43 },
    'Pune': { min: 18, max: 38 },
    'Ahmedabad': { min: 18, max: 46 },
    'Jaipur': { min: 15, max: 45 },
    'Lucknow': { min: 12, max: 44 }
  };
  const tempRange = cityTemps[city] || { min: 20, max: 38 };
  const temp = Math.floor(Math.random() * (tempRange.max - tempRange.min) + tempRange.min);

  const rainAmount = randomWeather === 'Rain' ? Math.random() * 15 + 2 :
    randomWeather === 'Thunderstorm' ? Math.random() * 25 + 5 :
      randomWeather === 'Drizzle' ? Math.random() * 3 : 0;

  return {
    city: city,
    temperature: temp,
    humidity: Math.floor(Math.random() * (85 - 40) + 40),
    weather: randomWeather,
    description: randomWeather.toLowerCase(),
    windSpeed: Math.floor(Math.random() * 35),
    cloudiness: Math.floor(Math.random() * 100),
    rainInLastHour: parseFloat(rainAmount.toFixed(1)),
    pressure: 1013,
    feelsLike: temp + Math.floor(Math.random() * 5 - 2),
    tempMin: temp - 2,
    tempMax: temp + 3
  };
};

/**
 * Calculate AQI
 */
const getAQI = async (city, rainInLastHour = 0) => {
  try {
    return generateMockAQI(city, rainInLastHour);
  } catch (error) {
    console.error('❌ AQI API Error:', error.message);
    return generateMockAQI(city, rainInLastHour);
  }
};

/**
 * Generate realistic mock AQI with city-specific baselines
 */
const generateMockAQI = (city, rainInLastHour = 0) => {
  const cityAQI = {
    'Delhi': { min: 150, max: 400 },
    'Mumbai': { min: 80, max: 200 },
    'Kolkata': { min: 100, max: 250 },
    'Bangalore': { min: 40, max: 120 },
    'Chennai': { min: 60, max: 150 },
    'Hyderabad': { min: 70, max: 180 },
    'Lucknow': { min: 120, max: 350 },
    'Ahmedabad': { min: 100, max: 250 }
  };
  const range = cityAQI[city] || { min: 50, max: 150 };
  let baseAQI = Math.floor(Math.random() * (range.max - range.min) + range.min);

  // Rain reduces pollution
  if (rainInLastHour > 0) {
    baseAQI = Math.max(20, baseAQI - rainInLastHour * 12);
  }

  return Math.round(baseAQI);
};

/**
 * Simulate order drop based on weather & AQI
 */
const simulateOrderDrop = (weather, aqi, temperature = 30) => {
  let orderDrop = 0;

  // Weather impact
  const weatherImpact = {
    'Rain': 30,
    'Thunderstorm': 55,
    'Fog': 20,
    'Haze': 15,
    'Drizzle': 15,
    'Cloudy': 5,
    'Clear': 0
  };
  orderDrop += weatherImpact[weather] || 10;

  // AQI impact
  if (aqi > 300) orderDrop += 30;
  else if (aqi > 200) orderDrop += 20;
  else if (aqi > 150) orderDrop += 12;
  else if (aqi > 100) orderDrop += 5;

  // Temperature extremes
  if (temperature > 44) orderDrop += 25;
  else if (temperature > 42) orderDrop += 15;
  else if (temperature > 40) orderDrop += 8;
  else if (temperature < 5) orderDrop += 20;
  else if (temperature < 10) orderDrop += 10;

  // Add some randomness (±5%)
  orderDrop += Math.floor(Math.random() * 10 - 5);

  return Math.min(100, Math.max(0, orderDrop));
};

/**
 * Get heat index classification
 */
const getHeatIndex = (temperature) => {
  if (temperature >= 47) return { level: "EXTREME_DANGER", description: "Heat stroke imminent", color: "red" };
  if (temperature >= 44) return { level: "DANGER", description: "Heat exhaustion likely", color: "orange" };
  if (temperature >= 42) return { level: "EXTREME_CAUTION", description: "Heat cramps possible", color: "yellow" };
  if (temperature >= 38) return { level: "CAUTION", description: "Fatigue possible", color: "blue" };
  return { level: "NORMAL", description: "Safe conditions", color: "green" };
};

/**
 * Simulate social disruption scenarios
 */
const simulateSocialDisruption = () => {
  const scenarios = [
    { type: "bandh", description: "State-wide bandh called", severity: "HIGH", orderDrop: 70 },
    { type: "curfew", description: "Night curfew imposed", severity: "MEDIUM", orderDrop: 45 },
    { type: "strike", description: "Local market strike", severity: "MEDIUM", orderDrop: 40 },
    { type: "protest", description: "Road closure due to protest", severity: "HIGH", orderDrop: 60 },
    { type: "floodAlert", description: "Flood warning issued", severity: "CRITICAL", orderDrop: 85 }
  ];
  return scenarios[Math.floor(Math.random() * scenarios.length)];
};

module.exports = {
  getWeatherData,
  getAQI,
  simulateOrderDrop,
  generateMockWeatherData,
  generateMockAQI,
  getHeatIndex,
  simulateSocialDisruption
};
