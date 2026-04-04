import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Crown, Shield, Calendar, TrendingUp, Star } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    icon: Shield,
    gradient: 'from-emerald-500 to-green-600',
    glow: 'rgba(16,185,129,0.25)',
    border: 'border-emerald-500/30',
    activeBorder: 'border-emerald-400',
    coverage: 2500,
    weeklyPremium: 49,
    incomeProtection: 50,
    features: [
      '50% income protection',
      '7-day active coverage',
      'Weather monitoring',
      'Email support',
    ],
  },
  {
    name: 'Standard',
    icon: Zap,
    gradient: 'from-blue-500 to-indigo-600',
    glow: 'rgba(99,102,241,0.35)',
    border: 'border-blue-500/30',
    activeBorder: 'border-blue-400',
    coverage: 5000,
    weeklyPremium: 99,
    incomeProtection: 60,
    recommended: true,
    features: [
      '60% income protection',
      '7-day active coverage',
      'Real-time weather + AQI alerts',
      'Priority support',
      'Auto-claim enabled',
    ],
  },
  {
    name: 'Pro',
    icon: Crown,
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.35)',
    border: 'border-violet-500/30',
    activeBorder: 'border-violet-400',
    coverage: 10000,
    weeklyPremium: 199,
    incomeProtection: 80,
    features: [
      '80% income protection',
      '7-day active coverage',
      '24/7 premium support',
      'Instant auto-claim',
      'Heat + Social disruption cover',
      'Dedicated account manager',
    ],
  },
];

const PlanSelectionPage = ({ riskLevel, riskScore, recommendedPlan, onSelectPlan, dailyIncome, userId }) => {
  const [selectedPlan, setSelectedPlan] = useState(recommendedPlan?.name || 'Standard');
  const [loading, setLoading] = useState(false);

  const weeklyIncome = (dailyIncome || 600) * 7;

  const handleBuy = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    try {
      const plan = plans.find(p => p.name === selectedPlan);
      const res = await fetch('http://localhost:5000/api/policy/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId, planType: selectedPlan,
          weeklyPremium: plan.weeklyPremium,
          riskScore: riskScore || 0, riskLevel: riskLevel || 'LOW'
        })
      });
      const data = await res.json();
      onSelectPlan(
        { planType: selectedPlan, coverage: plan.coverage, weeklyPremium: plan.weeklyPremium, incomeProtection: plan.incomeProtection },
        data.policy
      );
    } catch {
      const plan = plans.find(p => p.name === selectedPlan);
      onSelectPlan(
        { planType: selectedPlan, coverage: plan.coverage, weeklyPremium: plan.weeklyPremium, incomeProtection: plan.incomeProtection },
        null
      );
    } finally {
      setLoading(false);
    }
  };

  const activePlan = plans.find(p => p.name === selectedPlan);
  const riskColor = riskLevel === 'HIGH' ? 'text-red-400' : riskLevel === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400';

  return (
    <div
      className="min-h-screen py-12 px-4 relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(99,102,241,0.2) 0%, transparent 60%), #050814'
      }}
    >
      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Weekly Protection Plans</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-3">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Shield</span>
          </h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto">
            AI recommends&nbsp;
            <span className="font-bold text-white">{recommendedPlan?.name || 'Standard'}</span>
            &nbsp;based on your&nbsp;
            <span className={`font-bold ${riskColor}`}>{riskLevel}</span> risk level.
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-400">
            <span>Weekly Income: <strong className="text-white">₹{weeklyIncome.toLocaleString()}</strong></span>
            <span className="text-slate-600">•</span>
            <span>Risk: <strong className={riskColor}>{riskLevel}</strong></span>
            <span className="text-slate-600">•</span>
            <span>Score: <strong className="text-white">{(riskScore || 0).toFixed(2)}</strong></span>
          </div>
        </motion.div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.name;
            const effectiveCover = Math.min(Math.round(weeklyIncome * plan.incomeProtection / 100), plan.coverage);
            const dailyCost = (plan.weeklyPremium / 7).toFixed(1);

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => !loading && setSelectedPlan(plan.name)}
                className="relative cursor-pointer"
              >
                {/* Recommended badge */}
                {plan.recommended && (
                  <div className="absolute -top-3 inset-x-0 flex justify-center z-10">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${plan.gradient}`}>
                      ⭐ AI Recommended
                    </span>
                  </div>
                )}

                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`h-full rounded-2xl border-2 p-7 transition-all duration-300 ${
                    isSelected
                      ? `${plan.activeBorder} bg-white/[0.07]`
                      : `${plan.border} bg-white/[0.04] hover:bg-white/[0.06]`
                  }`}
                  style={isSelected ? { boxShadow: `0 0 50px -15px ${plan.glow}` } : {}}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-5 shadow-lg`}
                    style={{ boxShadow: `0 8px 24px -6px ${plan.glow}` }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h2 className="text-xl font-black text-white mb-1">{plan.name}</h2>

                  {/* Pricing */}
                  <div className="my-5 pb-5 border-b border-white/[0.07]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">₹{plan.weeklyPremium}</span>
                      <span className="text-slate-400 text-sm">/week</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">Just ₹{dailyCost}/day</p>
                    <div className="mt-3">
                      <p className="text-slate-500 text-xs">Coverage up to</p>
                      <p className={`font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r ${plan.gradient}`}>
                        ₹{plan.coverage.toLocaleString()}/week
                      </p>
                      <p className="text-slate-600 text-xs">= ₹{effectiveCover.toLocaleString()} for you ({plan.incomeProtection}%)</p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Select btn */}
                  <div className={`w-full py-2.5 rounded-xl text-sm font-bold text-center transition-all ${
                    isSelected
                      ? `bg-gradient-to-r ${plan.gradient} text-white`
                      : 'bg-white/[0.05] text-slate-400 border border-white/[0.08] hover:text-white'
                  }`}>
                    {isSelected ? '✓ Selected' : 'Select Plan'}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 mb-8 overflow-x-auto"
        >
          <h3 className="text-white font-bold text-sm mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" /> Full Plan Comparison
          </h3>
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-white/[0.07]">
                <th className="text-left py-2.5 px-3 text-slate-500 font-medium">Feature</th>
                <th className="text-center py-2.5 px-3 text-emerald-300 font-semibold">Basic</th>
                <th className="text-center py-2.5 px-3 text-blue-300 font-semibold">Standard</th>
                <th className="text-center py-2.5 px-3 text-violet-300 font-semibold">Pro</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Weekly Premium', '₹49', '₹99', '₹199'],
                ['Daily Cost', '₹7', '₹14', '₹28'],
                ['Coverage', '₹2,500', '₹5,000', '₹10,000'],
                ['Income Protection', '50%', '60%', '80%'],
                ['Auto-Claim', '✗', '✓', '✓'],
                ['AQI Monitoring', '✗', '✓', '✓'],
                ['Heat Alerts', '✗', '✗', '✓'],
                ['Social Disruption', '✗', '✗', '✓'],
              ].map(([label, ...vals], i) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 text-slate-400 font-medium">{label}</td>
                  {vals.map((v, j) => (
                    <td key={j} className={`py-3 px-3 text-center font-medium ${v === '✗' ? 'text-slate-700' : v === '✓' ? 'text-green-400' : 'text-white'}`}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Buy CTA */}
        <motion.button
          onClick={handleBuy}
          disabled={!selectedPlan || loading}
          whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 50px -10px rgba(99,102,241,0.7)' } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
            loading || !selectedPlan
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-2xl shadow-blue-900/50'
          }`}
        >
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Activating Policy...</>
          ) : (
            <>Activate {selectedPlan} Plan — ₹{activePlan?.weeklyPremium}/week →</>
          )}
        </motion.button>
        <p className="text-center text-slate-600 text-xs mt-4">
          ✅ Coverage starts immediately · Cancel anytime · AI-powered protection
        </p>
      </div>
    </div>
  );
};

export default PlanSelectionPage;
