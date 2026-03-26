import React, { useState, useRef } from 'react';
import { MapPin, IndianRupee, AlertCircle, CheckCircle, Cloud, Wind, Droplets, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Get color and icon based on risk level
 */
const getRiskStyling = (level) => {
  const styles = {
    LOW: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      badgeBg: 'bg-green-100',
      badgeText: 'text-green-800',
      badgeBorder: 'border-green-300',
      icon: CheckCircle,
      textColor: 'text-green-700'
    },
    MEDIUM: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
      badgeBg: 'bg-yellow-100',
      badgeText: 'text-yellow-800',
      badgeBorder: 'border-yellow-300',
      icon: AlertCircle,
      textColor: 'text-yellow-700'
    },
    HIGH: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-800',
      badgeBorder: 'border-red-300',
      icon: AlertCircle,
      textColor: 'text-red-700'
    }
  };
  return styles[level] || styles.LOW;
};

/**
 * Get risk level description
 */
const getRiskDescription = (level) => {
  const descriptions = {
    LOW: 'Low risk - Good conditions for operations',
    MEDIUM: 'Moderate risk - Exercise caution',
    HIGH: 'High risk - Significant operational challenges expected'
  };
  return descriptions[level];
};

/**
 * 🎯 Risk Calculator Component
 * Allows users to enter location and income, fetches real-time risk assessment
 * Shows weather data, AQI, order drop, and risk level
 */
const RiskCalculator = ({ onRiskCalculated }) => {
  const [formData, setFormData] = useState({
    location: '',
    income: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const resultRef = useRef(null);

  /**
   * Handle form submission - fetch risk data from backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate inputs
      if (!formData.location.trim()) {
        throw new Error('Please enter a location');
      }
      if (!formData.income || isNaN(formData.income)) {
        throw new Error('Please enter a valid income');
      }

      // Call backend API
      const response = await fetch('http://localhost:5000/api/risk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: formData.location.trim(),
          income: parseFloat(formData.income)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to calculate risk');
      }

      const data = await response.json();
      setRiskData(data.data);

      // Scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);

    } catch (err) {
      console.error('Risk calculation error:', err);
      setError(err.message || 'Failed to calculate risk. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle continue to next step
   */
  const handleContinue = () => {
    if (onRiskCalculated && riskData) {
      onRiskCalculated(riskData, formData.location, parseFloat(formData.income));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            🎯 Real-Time Risk Calculator
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Enter your location and daily income to get a real-time risk assessment with weather insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 📝 Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="h-6 w-6 text-cyan-400" />
              Enter Your Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location Input */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-200 mb-2">
                  📍 Work Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    id="location"
                    placeholder="e.g., Koramangala, Bangalore"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Income Input */}
              <div>
                <label htmlFor="income" className="block text-sm font-medium text-slate-200 mb-2">
                  💰 Daily Income (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    id="income"
                    placeholder="e.g., 500"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-lg flex items-center gap-2"
                  >
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? 'bg-slate-600 text-slate-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/50'
                }`}
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    Calculate Risk
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* 📊 Results Section */}
          {riskData && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Risk Score Card */}
              <RiskCard riskData={riskData} />

              {/* Weather Card */}
              <WeatherCard weather={riskData.weather} />

              {/* AQI & Order Drop Card */}
              <MetricsCard riskData={riskData} />

              {/* Continue Button */}
              {onRiskCalculated && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                  Continue to Plan Selection →
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Empty State */}
          {!riskData && !loading && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <div className="text-center text-slate-300">
                <Cloud className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Enter your details to calculate risk</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Risk Score Display Card
 */
const RiskCard = ({ riskData }) => {
  const styling = getRiskStyling(riskData.riskLevel);
  const RiskIcon = styling.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`bg-white/10 backdrop-blur-md border ${styling.borderColor} rounded-2xl p-6 shadow-2xl`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-2xl font-bold text-white">Risk Assessment</h3>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <RiskIcon className={`h-8 w-8 ${styling.textColor}`} />
        </motion.div>
      </div>

      <div className="space-y-4">
        {/* Risk Score */}
        <div>
          <p className="text-slate-300 text-sm mb-2">Risk Score</p>
          <div className="text-4xl font-bold text-white mb-2">
            {riskData.riskScore}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styling.badgeBg} ${styling.badgeText} border ${styling.badgeBorder}`}>
              {riskData.riskLevel}
            </span>
            <span className="text-slate-400 text-sm">{getRiskDescription(riskData.riskLevel)}</span>
          </div>
        </div>

        {/* Premium Multiplier */}
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-slate-300 text-sm mb-1">Insurance Premium Multiplier</p>
          <p className="text-2xl font-bold text-cyan-400">
            {riskData.premiumMultiplier}x
          </p>
          <p className="text-slate-400 text-xs mt-1">Your premium will be {Math.round((riskData.premiumMultiplier - 1) * 100)}% higher due to risk</p>
        </div>

        {/* Recommendation */}
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-slate-300 text-sm mb-1">Recommended Plan</p>
          <p className="text-xl font-bold text-white">
            {riskData.recommendation} Plan
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Weather Information Card
 */
const WeatherCard = ({ weather }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        🌤️ Weather Conditions
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <WeatherMetric icon={Cloud} label="Condition" value={weather.condition} />
        <WeatherMetric icon="🌡️" label="Temperature" value={`${weather.temperature}°C`} />
        <WeatherMetric icon="💧" label="Humidity" value={`${weather.humidity}%`} />
        <WeatherMetric icon={Wind} label="Wind Speed" value={`${weather.windSpeed} km/h`} />
        <WeatherMetric icon={Droplets} label="Rain (1h)" value={`${weather.rainInLastHour.toFixed(1)} mm`} />
        <WeatherMetric icon="🌡️" label="Feels Like" value={`${weather.feelsLike}°C`} />
      </div>

      <p className="text-slate-300 text-sm mt-4 text-center">
        📍 <strong>{weather.city}</strong>
      </p>
    </motion.div>
  );
};

/**
 * Weather Metric Component
 */
const WeatherMetric = ({ icon: Icon, label, value }) => {
  return (
    <div className="bg-white/5 rounded-lg p-3">
      <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
        {typeof Icon === 'string' ? (
          <span className="text-lg">{Icon}</span>
        ) : (
          <Icon className="h-4 w-4" />
        )}
        {label}
      </div>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
};

/**
 * Metrics Card - AQI and Order Drop
 */
const MetricsCard = ({ riskData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl"
    >
      <h3 className="text-xl font-bold text-white mb-4">Impact Metrics</h3>

      <div className="space-y-4">
        {/* AQI */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 text-sm">Air Quality Index</span>
            <span className="text-white font-bold">{riskData.aqi}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(riskData.aqi, 300) / 3}%` }}
            />
          </div>
          <p className="text-slate-400 text-xs mt-1">{riskData.aqiLevel}</p>
        </div>

        {/* Order Drop */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 text-sm">Expected Order Drop</span>
            <span className="text-white font-bold">{riskData.orderDrop}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${riskData.orderDrop}%` }}
            />
          </div>
        </div>

        {/* Estimated Loss */}
        <div className="bg-red-500/20 border border-red-400 rounded-xl p-4 mt-4">
          <p className="text-slate-300 text-sm mb-1">Estimated Weekly Loss</p>
          <p className="text-2xl font-bold text-red-300">
            ₹{riskData.estimatedWeeklyLoss || (riskData.estimatedDailyLoss * 7)}
          </p>
          <p className="text-slate-400 text-xs mt-1">
            ₹{riskData.estimatedDailyLoss}/day × 7 = Weekly estimate out of ₹{(riskData.dailyIncome * 7).toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// getRiskDescription already defined at top of file

export default RiskCalculator;
