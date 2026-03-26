import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Cloud, Droplets, BarChart3, TrendingUp, Thermometer, MapPin } from 'lucide-react';

const RiskResultPage = ({ riskData, onContinue }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!riskData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading risk assessment...</div>
      </div>
    );
  }

  const { weather, aqi, aqiLevel, orderDrop, riskScore, riskLevel, breakdown, dailyIncome, estimatedDailyLoss, estimatedWeeklyLoss, planRecommendation, heatIndex } = riskData;

  const weeklyIncome = dailyIncome * 7;
  const weeklyLoss = estimatedWeeklyLoss || estimatedDailyLoss * 7;

  const getLevelColor = (level) => {
    switch (level) {
      case 'LOW': return { border: 'border-green-400', text: 'text-green-300', badge: 'bg-green-100 text-green-800', bar: 'bg-green-500' };
      case 'MEDIUM': return { border: 'border-yellow-400', text: 'text-yellow-300', badge: 'bg-yellow-100 text-yellow-800', bar: 'bg-yellow-500' };
      case 'HIGH': return { border: 'border-red-400', text: 'text-red-300', badge: 'bg-red-100 text-red-800', bar: 'bg-red-500' };
      default: return { border: 'border-slate-400', text: 'text-slate-300', badge: 'bg-slate-100 text-slate-800', bar: 'bg-slate-500' };
    }
  };
  const colors = getLevelColor(riskLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">🎯 Your Risk Assessment</h1>
          <p className="text-slate-300">AI-powered analysis of your working conditions</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Risk Score Card */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className={`bg-white/10 backdrop-blur-md border ${colors.border} rounded-2xl p-8 shadow-2xl`}>
            <h2 className="text-slate-300 text-sm font-semibold mb-4">RISK LEVEL</h2>
            <div className={`text-6xl font-bold mb-4 ${colors.text}`}>{riskScore?.toFixed(2)}</div>
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${colors.badge}`}>{riskLevel}</span>
              {riskLevel === 'LOW' && <CheckCircle className="h-6 w-6 text-green-400" />}
              {riskLevel !== 'LOW' && <AlertCircle className={`h-6 w-6 ${colors.text}`} />}
            </div>
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <p className="text-slate-400 text-xs mb-1">Recommended Plan</p>
              <p className="text-white font-bold text-lg">{planRecommendation?.name} Plan</p>
              <p className="text-cyan-300 font-semibold mt-1">₹{planRecommendation?.weeklyPremium || planRecommendation?.premium}/week</p>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(riskScore * 100, 100)}%` }}
                transition={{ duration: 1 }} className={`h-full ${colors.bar}`} />
            </div>
            <p className="text-slate-400 text-xs mt-2">0 = Safe, 1 = Extreme Risk</p>
          </motion.div>

          {/* Weather Card */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-slate-300 text-sm font-semibold mb-6 flex items-center gap-2">
              <Cloud className="h-5 w-5 text-cyan-400" /> WEATHER CONDITIONS
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between"><span className="text-slate-400 text-sm">City</span><span className="text-white font-bold flex items-center gap-1"><MapPin className="h-3 w-3" />{weather?.city}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 text-sm">Condition</span><span className="text-white font-bold">{weather?.condition}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 text-sm">Temperature</span><span className="text-white font-bold">{weather?.temperature}°C</span></div>
              <div className="flex justify-between"><span className="text-slate-400 text-sm">Feels Like</span><span className="text-white font-bold">{weather?.feelsLike}°C</span></div>
              <div className="flex justify-between"><span className="text-slate-400 text-sm">Humidity</span><span className="text-white font-bold">{weather?.humidity}%</span></div>
              <div className="flex justify-between"><span className="text-slate-400 text-sm">Rain (1h)</span><span className="text-white font-bold flex items-center gap-1"><Droplets className="h-3 w-3 text-blue-400" />{weather?.rainInLastHour?.toFixed(1)} mm</span></div>
              {heatIndex && heatIndex.level !== 'NORMAL' && (
                <div className={`mt-2 p-2 rounded-lg ${heatIndex.level === 'EXTREME_DANGER' || heatIndex.level === 'DANGER' ? 'bg-red-500/20 border border-red-400' : 'bg-yellow-500/20 border border-yellow-400'}`}>
                  <p className="text-xs font-bold flex items-center gap-1"><Thermometer className="h-3 w-3" /> {heatIndex.description}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Impact Card */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-slate-300 text-sm font-semibold mb-6 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-400" /> IMPACT METRICS
            </h2>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2"><span className="text-slate-400 text-xs">AQI</span><span className="text-white font-bold">{aqi} ({aqiLevel})</span></div>
                <div className="w-full bg-white/10 rounded-full h-2"><div className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full" style={{ width: `${Math.min(aqi / 500 * 100, 100)}%` }} /></div>
              </div>
              <div>
                <div className="flex justify-between mb-2"><span className="text-slate-400 text-xs">Order Drop</span><span className="text-white font-bold">{orderDrop}%</span></div>
                <div className="w-full bg-white/10 rounded-full h-2"><div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{ width: `${orderDrop}%` }} /></div>
              </div>
              <div className="bg-red-500/20 border border-red-400 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Estimated Weekly Loss</p>
                <p className="text-red-300 font-bold text-2xl">₹{weeklyLoss?.toLocaleString()}</p>
                <p className="text-slate-400 text-xs mt-1">₹{estimatedDailyLoss}/day × 7 days</p>
              </div>
              <div className="bg-green-500/20 border border-green-400 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Protection Available</p>
                <p className="text-green-300 font-bold text-xl">Up to ₹{planRecommendation?.coverage?.toLocaleString()}/week</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Risk Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl mb-8">
          <button onClick={() => setShowDetails(!showDetails)} className="w-full flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-cyan-400" /> 🧠 AI Risk Breakdown
            </h2>
            <span className={`text-cyan-400 text-sm ${showDetails ? 'rotate-180' : ''} transition-transform`}>▼</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
            {[
              { icon: '🌧️', label: 'Rain', value: breakdown?.rainImpact, color: 'from-blue-500' },
              { icon: '🌫️', label: 'AQI', value: breakdown?.aqiImpact, color: 'from-orange-500' },
              { icon: '📉', label: 'Order Drop', value: breakdown?.orderDropImpact, color: 'from-red-500' },
              { icon: '🌡️', label: 'Heat', value: breakdown?.heatImpact, color: 'from-yellow-500' },
              { icon: '📍', label: 'Zone Risk', value: breakdown?.zoneImpact, color: 'from-purple-500' }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-slate-400 text-xs mt-2">{item.label}</p>
                <p className="text-cyan-300 font-bold text-lg">{(item.value || 0).toFixed(3)}</p>
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                  <div className={`bg-gradient-to-r ${item.color} to-cyan-500 h-1.5 rounded-full`}
                    style={{ width: `${Math.min((item.value || 0) * 400, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm mb-1 font-semibold">FINAL RISK SCORE</p>
                <p className="text-3xl font-bold text-cyan-300">{riskScore?.toFixed(3)}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-300 text-sm mb-1">Formula v2.0</p>
                <p className="text-slate-200 text-xs font-mono">rain×0.25 + aqi×0.20 + drop×0.25 + heat×0.15 + zone×0.15</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onContinue}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all text-lg">
          Choose Your Weekly Plan →
        </motion.button>
      </div>
    </div>
  );
};

export default RiskResultPage;
