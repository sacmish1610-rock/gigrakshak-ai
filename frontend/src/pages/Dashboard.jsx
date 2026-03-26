import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, AlertTriangle, CheckCircle, Zap, BarChart3, Bell, Beaker, LogOut, Shield, Calendar, Clock, TrendingUp, Flame, Wind, Ban, ArrowDown } from 'lucide-react';

const API = 'http://localhost:5000/api';

const Dashboard = ({ user, riskData, currentLocation, dailyIncome, selectedPlan, policyData, onLogout }) => {
  const [liveData, setLiveData] = useState({
    weather: 'Clear', temperature: 28, aqi: 85, orderDrop: 0, rainIntensity: 0, riskScore: 0.15
  });
  const [triggers, setTriggers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [simulation, setSimulation] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [claimHistory, setClaimHistory] = useState([]);
  const [claimStats, setClaimStats] = useState(null);
  const [activeTab, setActiveTab] = useState('monitor');
  const [toast, setToast] = useState(null);

  // Load claim history on mount
  useEffect(() => {
    if (user?.id) {
      fetchClaimHistory();
      fetchClaimStats();
    }
  }, [user?.id]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchClaimHistory = async () => {
    try {
      const res = await fetch(`${API}/claim/user/${user.id}`);
      const data = await res.json();
      if (data.success) setClaimHistory(data.claims || []);
    } catch (e) { console.error(e); }
  };

  const fetchClaimStats = async () => {
    try {
      const res = await fetch(`${API}/claim/stats/${user.id}`);
      const data = await res.json();
      if (data.success) setClaimStats(data.stats);
    } catch (e) { console.error(e); }
  };

  // Simulate disruption
  const simulateScenario = async (type, label) => {
    setIsSimulating(true);
    setSimulation(type);

    try {
      // Simulate via API
      const simRes = await fetch(`${API}/trigger/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, location: currentLocation, userId: user?.id })
      });
      const simData = await simRes.json();
      const scenario = simData.data?.scenario || {};
      const triggerResult = simData.data?.triggerResult || {};

      // Update live data
      setLiveData(prev => ({
        ...prev,
        weather: type === 'rain' ? 'Rain' : type === 'heat' ? 'Clear' : prev.weather,
        temperature: scenario.temperature || prev.temperature,
        aqi: scenario.aqi || prev.aqi,
        orderDrop: (scenario.orderDrop || 0) / 100,
        rainIntensity: scenario.rain || 0,
        riskScore: Math.min((scenario.rain || 0) * 0.025 + (scenario.aqi || 0) / 2500 + (scenario.orderDrop || 0) / 250, 1)
      }));

      if (triggerResult.triggered) {
        const primary = triggerResult.primaryTrigger;
        setTriggers(prev => [{
          id: Date.now(),
          reason: primary?.reason || label,
          severity: primary?.severity || 'HIGH',
          triggerType: primary?.triggerType || type,
          icon: primary?.icon || '🚨',
          timestamp: new Date(),
          processed: false
        }, ...prev]);

        showToast(`🚨 ${primary?.reason || 'Trigger activated!'}`, 'warning');

        // Auto-claim
        await processAutoClaim(primary, scenario);
      } else {
        showToast('✅ No trigger conditions met', 'info');
      }
    } catch (error) {
      console.error('Simulation error:', error);
      showToast('❌ Simulation failed', 'error');
    } finally {
      setTimeout(() => { setSimulation(null); setIsSimulating(false); }, 1500);
    }
  };

  const processAutoClaim = async (trigger, scenario) => {
    try {
      const res = await fetch(`${API}/claim/auto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          income: dailyIncome,
          triggerReason: trigger?.reason || 'Parametric trigger',
          triggerType: trigger?.triggerType || 'other',
          riskScore: liveData.riskScore,
          severity: trigger?.severity || 'MEDIUM',
          weatherSnapshot: {
            temperature: scenario?.temperature || liveData.temperature,
            weather: liveData.weather,
            rainInLastHour: scenario?.rain || liveData.rainIntensity,
            aqi: scenario?.aqi || liveData.aqi,
            orderDrop: scenario?.orderDrop || liveData.orderDrop * 100,
            humidity: 70
          }
        })
      });

      const data = await res.json();

      if (data.success) {
        setClaims(prev => [{
          id: data.data.claimId || Date.now(),
          amount: data.data.amount,
          status: data.data.status,
          reason: data.data.reason,
          triggerType: data.data.triggerType,
          fraudScore: data.data.fraudScore,
          processingTimeMs: data.data.processingTimeMs,
          timestamp: new Date()
        }, ...prev]);

        setTriggers(prev => prev.map((t, i) => i === 0 ? { ...t, processed: true } : t));
        showToast(data.data.notification || `💰 ₹${data.data.amount} claim processed!`, 'success');
        fetchClaimHistory();
        fetchClaimStats();
      }
    } catch (error) {
      console.error('Auto-claim error:', error);
    }
  };

  const getRiskColor = (score) => {
    if (score < 0.3) return { text: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-400', bar: 'bg-green-500' };
    if (score < 0.6) return { text: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-400', bar: 'bg-yellow-500' };
    return { text: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-400', bar: 'bg-red-500' };
  };

  const riskColor = getRiskColor(liveData.riskScore);
  const weeklyIncome = dailyIncome * 7;
  const policy = policyData || {};
  const daysRemaining = policy.endDate ? Math.max(0, Math.ceil((new Date(policy.endDate) - new Date()) / (1000 * 60 * 60 * 24))) : 7;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border-b border-white/10 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" /> GigRakshak Dashboard
            </h1>
            <p className="text-slate-400 text-sm">Welcome, {user?.name} • {currentLocation}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/30">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-semibold">{selectedPlan?.planType || 'Standard'} Plan</span>
            </div>
            <button onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 border border-red-400/30 text-red-300 hover:bg-red-500/30 transition-all text-sm">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
        {/* Tab Nav */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          {[
            { id: 'monitor', label: '📊 Monitor', icon: BarChart3 },
            { id: 'simulate', label: '🧪 Simulate', icon: Beaker },
            { id: 'claims', label: '💰 Claims', icon: CheckCircle },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-all rounded-t-lg ${
                activeTab === tab.id ? 'bg-white/10 text-cyan-300 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* MONITOR TAB */}
        {activeTab === 'monitor' && (
          <div className="space-y-6">
            {/* Top Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="💰" label="Weekly Income" value={`₹${weeklyIncome.toLocaleString()}`} sub={`₹${dailyIncome}/day`} />
              <StatCard icon="🛡️" label="Coverage" value={`₹${(selectedPlan?.coverage || 5000).toLocaleString()}`} sub={`${selectedPlan?.incomeProtection || 60}% protection`} />
              <StatCard icon="📋" label="Policy" value={policy.policyNumber || 'Active'} sub={`${daysRemaining} days left`} />
              <StatCard icon="💸" label="Claims Paid" value={`₹${claimStats?.totalPaid?.toLocaleString() || '0'}`} sub={`${claimStats?.totalClaims || 0} total claims`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Live Risk Status */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`bg-white/10 backdrop-blur-md border ${riskColor.border} rounded-2xl p-6 shadow-2xl`}>
                <h2 className="text-slate-300 text-sm font-semibold mb-4">LIVE RISK STATUS</h2>
                <div className={`text-5xl font-bold mb-3 ${riskColor.text}`}>{liveData.riskScore.toFixed(2)}</div>
                <div className="w-full bg-white/10 rounded-full h-2.5 mb-4">
                  <motion.div animate={{ width: `${Math.min(liveData.riskScore * 100, 100)}%` }}
                    className={`h-full rounded-full ${riskColor.bar}`} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-slate-400">🌤️ Weather</span><span className="text-white font-bold">{liveData.weather}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-slate-400">🌡️ Temp</span><span className="text-white font-bold">{liveData.temperature}°C</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-slate-400">🌫️ AQI</span><span className="text-white font-bold">{Math.round(liveData.aqi)}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-slate-400">📉 Order Drop</span><span className="text-white font-bold">{(liveData.orderDrop * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-slate-400">🌧️ Rain</span><span className="text-white font-bold">{liveData.rainIntensity.toFixed(1)} mm</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-slate-400 text-xs">Live • Updates on simulation</p>
                </div>
              </motion.div>

              {/* Policy Details */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cyan-400" /> Active Policy
                </h2>
                <div className="space-y-3">
                  <div className="bg-cyan-500/20 border border-cyan-400/30 rounded-xl p-4">
                    <p className="text-slate-400 text-xs">Plan</p>
                    <p className="text-cyan-300 font-bold text-xl">{selectedPlan?.planType || 'Standard'} Plan</p>
                    <p className="text-slate-300 text-sm mt-1">₹{selectedPlan?.weeklyPremium || 99}/week</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-slate-400 text-xs">Coverage</p>
                      <p className="text-white font-bold">₹{(selectedPlan?.coverage || 5000).toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-slate-400 text-xs">Protection</p>
                      <p className="text-white font-bold">{selectedPlan?.incomeProtection || 60}%</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-slate-400 text-xs">Policy Number</p>
                    <p className="text-white font-mono text-sm">{policy.policyNumber || 'GR-STD-XXXX'}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-slate-400 text-xs">Validity</p>
                        <p className="text-white font-bold">{daysRemaining} days remaining</p>
                      </div>
                      <Calendar className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                      <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${(daysRemaining / 7) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-yellow-400" /> Recent Activity
                </h2>
                {triggers.length === 0 && claims.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400 text-sm">No activity yet</p>
                    <p className="text-slate-500 text-xs mt-2">Run a simulation to test triggers!</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {[...triggers.map(t => ({ ...t, type: 'trigger' })), ...claims.map(c => ({ ...c, type: 'claim' }))]
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .slice(0, 8)
                      .map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                          className={`p-3 rounded-lg border text-sm ${
                            item.type === 'claim' ? 'bg-green-500/10 border-green-400/30' :
                            item.severity === 'HIGH' || item.severity === 'CRITICAL' ? 'bg-red-500/10 border-red-400/30' :
                            'bg-yellow-500/10 border-yellow-400/30'
                          }`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-white font-medium text-xs">
                                {item.type === 'claim' ? `💰 ₹${item.amount} ${item.status}` : `🚨 ${item.reason}`}
                              </p>
                              <p className="text-slate-400 text-xs mt-0.5">
                                {new Date(item.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                            {item.type === 'claim' && item.status === 'APPROVED' && (
                              <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}

        {/* SIMULATE TAB */}
        {activeTab === 'simulate' && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-white mb-2">🧪 Disruption Simulator</h2>
              <p className="text-slate-400">Test the 5 parametric triggers that protect you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { type: 'rain', label: '🌧️ Heavy Rain', desc: 'Simulate heavy rainfall', color: 'blue', icon: Cloud },
                { type: 'heat', label: '🔥 Extreme Heat', desc: 'Simulate heat wave', color: 'orange', icon: Flame },
                { type: 'aqi', label: '🌫️ Poor AQI', desc: 'Simulate air pollution', color: 'purple', icon: Wind },
                { type: 'social', label: '🚫 Social Disruption', desc: 'Simulate bandh/strike', color: 'red', icon: Ban },
                { type: 'orderdrop', label: '📉 Severe Order Drop', desc: 'Simulate order crash', color: 'yellow', icon: ArrowDown }
              ].map(sim => (
                <motion.button key={sim.type} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => simulateScenario(sim.type, sim.label)}
                  disabled={isSimulating}
                  className={`p-6 rounded-2xl bg-${sim.color}-500/10 border border-${sim.color}-400/30 hover:bg-${sim.color}-500/20 disabled:opacity-50 transition-all text-center`}
                  style={{
                    backgroundColor: `rgba(${sim.color === 'blue' ? '59,130,246' : sim.color === 'orange' ? '249,115,22' : sim.color === 'purple' ? '168,85,247' : sim.color === 'red' ? '239,68,68' : '234,179,8'}, 0.1)`,
                    borderColor: `rgba(${sim.color === 'blue' ? '59,130,246' : sim.color === 'orange' ? '249,115,22' : sim.color === 'purple' ? '168,85,247' : sim.color === 'red' ? '239,68,68' : '234,179,8'}, 0.3)`
                  }}
                >
                  <div className="text-3xl mb-3">{sim.label.split(' ')[0]}</div>
                  <p className="text-white font-semibold text-sm">{sim.label.split(' ').slice(1).join(' ')}</p>
                  <p className="text-slate-400 text-xs mt-1">{sim.desc}</p>
                </motion.button>
              ))}
            </div>

            {/* Simulation Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Triggers */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" /> Trigger Alerts ({triggers.length})
                </h3>
                {triggers.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-6">Run a simulation to see triggers</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {triggers.slice(0, 10).map(t => (
                      <div key={t.id} className={`p-3 rounded-lg border ${
                        t.severity === 'CRITICAL' ? 'bg-red-500/20 border-red-400' :
                        t.severity === 'HIGH' ? 'bg-orange-500/20 border-orange-400' :
                        'bg-yellow-500/20 border-yellow-400'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-semibold text-sm">{t.icon} {t.reason}</p>
                            <p className="text-slate-300 text-xs mt-1">{t.severity} • {new Date(t.timestamp).toLocaleTimeString()}</p>
                          </div>
                          {t.processed && <span className="text-green-300 text-xs flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Claimed</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Auto-Claims */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  💰 Auto-Claims ({claims.length})
                </h3>
                {claims.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-6">Claims appear when triggers fire</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {claims.slice(0, 10).map(c => (
                      <div key={c.id} className={`p-3 rounded-lg border ${
                        c.status === 'APPROVED' ? 'bg-green-500/15 border-green-400/50' : 'bg-yellow-500/15 border-yellow-400/50'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className={`font-bold text-sm ${c.status === 'APPROVED' ? 'text-green-300' : 'text-yellow-300'}`}>
                              {c.status === 'APPROVED' ? '✅' : '⏳'} ₹{c.amount} {c.status}
                            </p>
                            <p className="text-slate-300 text-xs mt-1">{c.reason}</p>
                            <p className="text-slate-400 text-xs mt-0.5">
                              Fraud: {c.fraudScore} • {c.processingTimeMs}ms • {new Date(c.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          <span className="text-xs text-slate-400 bg-white/10 px-2 py-0.5 rounded">{c.triggerType}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CLAIMS TAB */}
        {activeTab === 'claims' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            {claimStats && (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard icon="📊" label="Total Claims" value={claimStats.totalClaims} />
                <StatCard icon="✅" label="Approved" value={claimStats.approved} sub={`${claimStats.successRate}% rate`} />
                <StatCard icon="💰" label="Total Paid" value={`₹${claimStats.totalPaid?.toLocaleString()}`} />
                <StatCard icon="📈" label="Avg Amount" value={`₹${claimStats.avgClaimAmount}`} />
                <StatCard icon="⚡" label="Avg Speed" value={`${claimStats.avgProcessingTimeMs}ms`} sub="Processing" />
              </div>
            )}

            {/* Claim History */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-cyan-400" /> Claim History
              </h3>
              {claimHistory.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400">No claims yet</p>
                  <p className="text-slate-500 text-sm mt-2">Go to "🧪 Simulate" tab to trigger your first claim!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {claimHistory.map((c, i) => (
                    <motion.div key={c._id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className={`p-4 rounded-xl border ${
                        c.status === 'APPROVED' ? 'bg-green-500/10 border-green-400/30' :
                        c.status === 'PENDING' ? 'bg-yellow-500/10 border-yellow-400/30' :
                        'bg-red-500/10 border-red-400/30'
                      }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{c.status === 'APPROVED' ? '✅' : c.status === 'PENDING' ? '⏳' : '❌'}</span>
                          <div>
                            <p className="text-white font-bold">₹{c.amount} — {c.status}</p>
                            <p className="text-slate-300 text-xs">{c.reason}</p>
                            <p className="text-slate-400 text-xs mt-1">
                              {c.triggerType} • Fraud: {c.fraudScore} • {new Date(c.createdAt).toLocaleDateString()} {new Date(c.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {c.weatherSnapshot && (
                            <p className="text-slate-400 text-xs">
                              {c.weatherSnapshot.weather} {c.weatherSnapshot.temperature}°C
                            </p>
                          )}
                          <p className="text-cyan-300 text-xs font-mono">{c.payoutMethod || 'UPI'}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 px-6 py-3 rounded-xl font-semibold text-sm shadow-2xl backdrop-blur-md border z-50 ${
              toast.type === 'success' ? 'bg-green-500/20 border-green-400 text-green-200' :
              toast.type === 'warning' ? 'bg-yellow-500/20 border-yellow-400 text-yellow-200' :
              toast.type === 'error' ? 'bg-red-500/20 border-red-400 text-red-200' :
              'bg-blue-500/20 border-blue-400 text-blue-200'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulation Overlay */}
      <AnimatePresence>
        {simulation && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-20 right-6 bg-yellow-500/20 border border-yellow-400 rounded-xl p-4 text-yellow-200 font-semibold flex items-center gap-2 z-50 backdrop-blur-md">
            <div className="h-4 w-4 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin" />
            Simulating {simulation}...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-lg">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-lg">{icon}</span>
      <span className="text-slate-400 text-xs">{label}</span>
    </div>
    <p className="text-white font-bold text-lg">{value}</p>
    {sub && <p className="text-slate-400 text-xs mt-0.5">{sub}</p>}
  </motion.div>
);

export default Dashboard;
