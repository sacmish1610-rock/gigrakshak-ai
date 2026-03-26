import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Crown, Shield, Calendar, TrendingUp } from 'lucide-react';

const PlanSelectionPage = ({ riskLevel, riskScore, recommendedPlan, onSelectPlan, dailyIncome, userId }) => {
  const [selectedPlan, setSelectedPlan] = useState(recommendedPlan?.name || 'Standard');
  const [loading, setLoading] = useState(false);

  const weeklyIncome = dailyIncome * 7;

  const plans = [
    {
      name: 'Basic',
      icon: Shield,
      description: 'Essential weekly protection',
      coverage: 2500,
      weeklyPremium: 49,
      incomeProtection: 50,
      features: [
        '50% income protection',
        '7-day active coverage',
        'Weather monitoring',
        'Email support'
      ],
      color: 'from-emerald-500 to-green-600',
      borderColor: 'border-emerald-400',
      bgColor: 'bg-emerald-500/10'
    },
    {
      name: 'Standard',
      icon: Zap,
      description: 'Best value for most workers',
      coverage: 5000,
      weeklyPremium: 99,
      incomeProtection: 60,
      features: [
        '60% income protection',
        '7-day active coverage',
        'Real-time weather alerts',
        'Priority support',
        'Auto-claim enabled',
        'AQI monitoring'
      ],
      color: 'from-cyan-500 to-blue-600',
      borderColor: 'border-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    {
      name: 'Pro',
      icon: Crown,
      description: 'Maximum weekly coverage',
      coverage: 10000,
      weeklyPremium: 199,
      incomeProtection: 80,
      features: [
        '80% income protection',
        '7-day active coverage',
        '24/7 premium support',
        'Instant auto-claim',
        'Weather + AQI + Heat alerts',
        'Weekly analytics reports',
        'Social disruption coverage'
      ],
      color: 'from-purple-500 to-indigo-600',
      borderColor: 'border-purple-400',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const handleBuyPolicy = async () => {
    if (!selectedPlan) return;
    setLoading(true);

    try {
      const plan = plans.find(p => p.name === selectedPlan);

      const response = await fetch('http://localhost:5000/api/policy/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          planType: selectedPlan,
          weeklyPremium: plan.weeklyPremium,
          riskScore: riskScore || 0,
          riskLevel: riskLevel || 'LOW'
        })
      });

      if (!response.ok) throw new Error('Failed to buy policy');

      const data = await response.json();

      onSelectPlan(
        { planType: selectedPlan, coverage: plan.coverage, weeklyPremium: plan.weeklyPremium, incomeProtection: plan.incomeProtection },
        data.policy
      );
    } catch (error) {
      console.error('Error buying policy:', error);
      alert('Failed to purchase policy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 mb-4">
            <Calendar className="h-4 w-4 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-semibold">Weekly Insurance Plans</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Weekly Protection</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            AI recommends <span className="font-bold text-cyan-400">{recommendedPlan?.name || 'Standard'}</span> based on your {riskLevel} risk level.
            All plans are billed weekly — cancel anytime.
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-slate-400">
            <span>Weekly Income: <strong className="text-white">₹{weeklyIncome.toLocaleString()}</strong></span>
            <span>Risk: <strong className={riskLevel === 'HIGH' ? 'text-red-400' : riskLevel === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'}>{riskLevel}</strong></span>
          </div>
        </motion.div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.name;
            const isRecommended = recommendedPlan?.name === plan.name;
            const effectiveCoverage = Math.min(Math.round(weeklyIncome * (plan.incomeProtection / 100)), plan.coverage);
            const dailyCost = (plan.weeklyPremium / 7).toFixed(1);

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedPlan(plan.name)}
                className="relative cursor-pointer"
              >
                {isRecommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className={`bg-gradient-to-r ${plan.color} text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg`}>
                      ⭐ AI Recommended
                    </div>
                  </div>
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`h-full bg-white/10 backdrop-blur-md border-2 rounded-2xl p-8 shadow-2xl transition-all ${
                    isSelected ? `${plan.borderColor} ring-2 ring-cyan-400/30 shadow-cyan-500/10` :
                    isRecommended ? `${plan.borderColor}/50` : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="mb-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${plan.bgColor}`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-1">{plan.name}</h2>
                  <p className="text-slate-300 text-sm mb-6">{plan.description}</p>

                  {/* Pricing */}
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-3xl font-bold text-white">₹{plan.weeklyPremium}</span>
                      <span className="text-slate-400 text-sm">/week</span>
                    </div>
                    <p className="text-slate-400 text-xs">Just ₹{dailyCost}/day</p>
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-slate-400 text-xs">Coverage up to</p>
                      <p className="text-cyan-300 font-bold text-lg">₹{plan.coverage.toLocaleString()}/week</p>
                      <p className="text-slate-400 text-xs mt-1">Effective: ₹{effectiveCoverage.toLocaleString()} ({plan.incomeProtection}% of weekly income)</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2.5 mb-6">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-200 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      isSelected ? `bg-gradient-to-r ${plan.color} text-white shadow-lg` :
                      'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {isSelected ? '✓ Selected' : 'Select Plan'}
                  </motion.button>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" /> Plan Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-slate-300">Feature</th>
                  <th className="text-center py-3 px-4 text-emerald-300">Basic</th>
                  <th className="text-center py-3 px-4 text-cyan-300">Standard</th>
                  <th className="text-center py-3 px-4 text-purple-300">Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Weekly Premium', '₹49', '₹99', '₹199'],
                  ['Daily Cost', '₹7', '₹14.1', '₹28.4'],
                  ['Coverage/Week', '₹2,500', '₹5,000', '₹10,000'],
                  ['Income Protection', '50%', '60%', '80%'],
                  ['Weather Alerts', '✓', '✓', '✓'],
                  ['Auto-Claim', '✗', '✓', '✓'],
                  ['Heat Alerts', '✗', '✗', '✓'],
                  ['Social Disruption', '✗', '✗', '✓'],
                  ['24/7 Support', '✗', '✗', '✓'],
                ].map(([label, ...vals], i) => (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4 text-slate-300">{label}</td>
                    {vals.map((v, j) => (
                      <td key={j} className={`py-3 px-4 text-center ${v === '✗' ? 'text-slate-500' : 'text-slate-200'}`}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Buy Button */}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleBuyPolicy}
          disabled={!selectedPlan || loading}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
            loading || !selectedPlan
              ? 'bg-slate-600 text-slate-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/50'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing Payment...
            </div>
          ) : (
            `Buy ${selectedPlan} Plan — ₹${plans.find(p => p.name === selectedPlan)?.weeklyPremium}/week`
          )}
        </motion.button>

        <p className="text-center text-slate-400 text-sm mt-4">
          ✅ All plans include 7-day coverage starting now • Cancel anytime • AI-powered protection
        </p>
      </div>
    </div>
  );
};

export default PlanSelectionPage;
