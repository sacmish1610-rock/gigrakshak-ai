import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, ChevronDown, MapPin, Droplets, Thermometer, TrendingDown, Brain } from 'lucide-react';

/* ── Animated circular ring SVG ────── */
const RiskRing = ({ score, level, size = 180 }) => {
  const R = 70;
  const C = 2 * Math.PI * R;
  const pct = Math.min(score, 1);
  const stroke = pct > 0.7 ? '#ef4444' : pct > 0.4 ? '#f59e0b' : '#10b981';
  const strokeGlow = pct > 0.7 ? 'rgba(239,68,68,0.5)' : pct > 0.4 ? 'rgba(245,158,11,0.5)' : 'rgba(16,185,129,0.5)';

  return (
    <svg width={size} height={size} viewBox="0 0 160 160" className="drop-shadow-xl">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Track */}
      <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
      {/* Progress arc */}
      <motion.circle
        cx="80" cy="80" r={R}
        fill="none"
        stroke={stroke}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={C}
        initial={{ strokeDashoffset: C }}
        animate={{ strokeDashoffset: C * (1 - pct) }}
        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
        transform="rotate(-90 80 80)"
        filter="url(#glow)"
        style={{ filter: `drop-shadow(0 0 8px ${strokeGlow})` }}
      />
      {/* Score text */}
      <text x="80" y="72" textAnchor="middle" fill="white" fontSize="28" fontWeight="900" fontFamily="Inter,sans-serif">
        {(score || 0).toFixed(2)}
      </text>
      <text x="80" y="92" textAnchor="middle" fill={stroke} fontSize="11" fontWeight="700" fontFamily="Inter,sans-serif" letterSpacing="2">
        {level}
      </text>
    </svg>
  );
};

/* ── Stat chip ───────────────────────── */
const Chip = ({ icon, label, value, sub, color = 'text-white' }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.07]">
    <span className="text-xl flex-shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-slate-500 text-xs font-medium">{label}</p>
      <p className={`font-bold text-base truncate ${color}`}>{value}</p>
      {sub && <p className="text-slate-600 text-xs mt-0.5">{sub}</p>}
    </div>
  </div>
);

/* ── Impact bar ──────────────────────── */
const ImpactBar = ({ icon, label, value, color }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
        <span>{icon}</span>{label}
      </span>
      <span className="text-white text-xs font-bold tabular-nums">{(value || 0).toFixed(3)}</span>
    </div>
    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min((value || 0) * 350, 100)}%` }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  </div>
);

const RiskResultPage = ({ riskData, onContinue }) => {
  const [expanded, setExpanded] = useState(true);

  if (!riskData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#050814' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400">Analyzing your risk profile...</p>
        </div>
      </div>
    );
  }

  const {
    weather, aqi, aqiLevel, orderDrop, riskScore, riskLevel,
    breakdown, dailyIncome, estimatedDailyLoss, estimatedWeeklyLoss,
    planRecommendation, heatIndex
  } = riskData;

  const weeklyLoss = estimatedWeeklyLoss || (estimatedDailyLoss * 7);
  const levelColor = riskLevel === 'HIGH' ? 'text-red-400' : riskLevel === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400';

  return (
    <div
      className="min-h-screen py-10 px-4 relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.2) 0%, transparent 60%), #050814'
      }}
    >
      {/* Background accents */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Risk Assessment Complete</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Your AI Risk Profile</h1>
          <p className="text-slate-400 mt-2 text-sm">Generated in real-time using live weather, AQI and market data</p>
        </motion.div>

        {/* ── Main 3-column grid ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

          {/* 1 — Risk Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] rounded-2xl p-7 flex flex-col items-center text-center"
            style={{
              boxShadow: riskLevel === 'HIGH'
                ? '0 0 60px -20px rgba(239,68,68,0.3)'
                : riskLevel === 'MEDIUM'
                ? '0 0 60px -20px rgba(245,158,11,0.3)'
                : '0 0 60px -20px rgba(16,185,129,0.3)'
            }}
          >
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-5">Risk Score</p>
            <RiskRing score={riskScore || 0} level={riskLevel} />
            <div className="mt-5 w-full">
              <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3.5">
                <p className="text-slate-500 text-xs mb-1">AI Recommended Plan</p>
                <p className="text-white font-bold">{planRecommendation?.name} Plan</p>
                <p className="text-blue-400 font-bold text-lg mt-1">
                  ₹{planRecommendation?.weeklyPremium || planRecommendation?.premium}
                  <span className="text-slate-500 text-sm font-normal">/week</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* 2 — Weather */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] rounded-2xl p-7"
          >
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-5">Live Conditions</p>
            <div className="space-y-2.5">
              <Chip icon="📍" label="Location" value={weather?.city} color="text-white" />
              <Chip icon="🌤️" label="Weather" value={weather?.condition || weather?.weather} color="text-sky-300" />
              <Chip icon="🌡️" label="Temperature" value={`${weather?.temperature}°C`}
                sub={`Feels like ${weather?.feelsLike}°C`} color="text-orange-300" />
              <Chip icon="💧" label="Rain (1h)" value={`${(weather?.rainInLastHour || 0).toFixed(1)} mm`}
                color="text-blue-300" />
              <Chip icon="💨" label="Humidity" value={`${weather?.humidity}%`} color="text-slate-200" />
              {heatIndex && heatIndex.level !== 'NORMAL' && (
                <div className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold border ${
                  heatIndex.level.includes('DANGER')
                    ? 'bg-red-500/10 border-red-500/20 text-red-300'
                    : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300'
                }`}>
                  <Thermometer className="w-3.5 h-3.5 flex-shrink-0" />
                  {heatIndex.description}
                </div>
              )}
            </div>
          </motion.div>

          {/* 3 — Impact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] rounded-2xl p-7"
          >
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-5">Income Impact</p>
            <div className="space-y-2.5 mb-5">
              <Chip icon="🌫️" label="AQI Index" value={`${aqi} — ${aqiLevel}`} color="text-orange-300" />
              <Chip icon="📉" label="Order Drop" value={`${orderDrop}%`} color="text-yellow-300" />
            </div>

            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-slate-500 text-xs mb-1">Est. Weekly Loss</p>
                <p className="text-red-300 font-black text-2xl">₹{(weeklyLoss || 0).toLocaleString()}</p>
                <p className="text-slate-600 text-xs mt-0.5">₹{estimatedDailyLoss}/day × 7 days</p>
              </div>
              <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="text-slate-500 text-xs mb-1">AI Protection Cover</p>
                <p className="text-green-300 font-black text-lg">Up to ₹{(planRecommendation?.coverage || 0).toLocaleString()}</p>
                <p className="text-slate-600 text-xs mt-0.5">per week</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── AI Risk Breakdown ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] rounded-2xl p-7 mb-6"
        >
          <button
            onClick={() => setExpanded(v => !v)}
            className="w-full flex items-center justify-between mb-0"
          >
            <h2 className="text-white font-bold text-lg flex items-center gap-2.5">
              <Brain className="w-5 h-5 text-indigo-400" />
              AI Explanation — Why This Risk?
            </h2>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
                  {[
                    { icon: '🌧️', label: 'Rain', value: breakdown?.rainImpact,      color: 'bg-blue-500' },
                    { icon: '🌫️', label: 'AQI',  value: breakdown?.aqiImpact,       color: 'bg-orange-500' },
                    { icon: '📉', label: 'Orders',value: breakdown?.orderDropImpact, color: 'bg-red-500' },
                    { icon: '🌡️', label: 'Heat',  value: breakdown?.heatImpact,      color: 'bg-yellow-500' },
                    { icon: '📍', label: 'Zone',  value: breakdown?.zoneImpact,      color: 'bg-purple-500' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4">
                      <span className="text-xl">{item.icon}</span>
                      <p className="text-slate-500 text-xs mt-2">{item.label}</p>
                      <p className="text-white font-bold text-base mt-0.5">{(item.value || 0).toFixed(3)}</p>
                      <div className="mt-2 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((item.value || 0) * 400, 100)}%` }}
                          transition={{ duration: 0.8, delay: 0.4 + i * 0.05 }}
                          className={`h-full rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formula */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                  <div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Risk Formula v2.0</p>
                    <p className="text-slate-300 text-xs font-mono">rain×0.25 + aqi×0.20 + order_drop×0.25 + heat×0.15 + zone×0.15</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-slate-400 text-xs mb-0.5">Final Score</p>
                    <p className={`text-3xl font-black tabular-nums ${levelColor}`}>{(riskScore || 0).toFixed(3)}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── CTA ───────────────────────────────── */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onContinue}
          whileHover={{ scale: 1.02, boxShadow: '0 0 40px -10px rgba(99,102,241,0.7)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl shadow-blue-900/40 transition-all flex items-center justify-center gap-2"
        >
          Choose Your Weekly Plan →
        </motion.button>

      </div>
    </div>
  );
};

export default RiskResultPage;
