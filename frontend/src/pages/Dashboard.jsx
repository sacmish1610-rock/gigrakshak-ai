import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cloud, AlertTriangle, CheckCircle, Zap, LogOut, Shield,
  Clock, TrendingUp, Wind, RefreshCw, ChevronRight, Activity,
  Thermometer, Droplets, BarChart2
} from 'lucide-react';

const API = 'http://localhost:5000/api';

/* ──────────────────────────────────────────
   🎛️ Circular Risk Meter
────────────────────────────────────────── */
const RiskMeter = ({ score }) => {
  const R = 54, C = 2 * Math.PI * R;
  const pct = Math.min(score || 0, 1);
  const color = pct > 0.7 ? '#ef4444' : pct > 0.4 ? '#f59e0b' : '#10b981';
  const glow  = pct > 0.7 ? 'rgba(239,68,68,0.6)' : pct > 0.4 ? 'rgba(245,158,11,0.6)' : 'rgba(16,185,129,0.6)';
  const label = pct > 0.7 ? 'HIGH' : pct > 0.4 ? 'MEDIUM' : 'LOW';

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 130 130">
        <defs>
          <filter id="rm-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
        <motion.circle
          cx="65" cy="65" r={R} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - pct) }}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          transform="rotate(-90 65 65)"
          style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
        />
        <text x="65" y="59" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="Inter,sans-serif">{pct.toFixed(2)}</text>
        <text x="65" y="75" textAnchor="middle" fill={color} fontSize="9" fontWeight="700" fontFamily="Inter,sans-serif" letterSpacing="2">{label} RISK</text>
      </svg>
    </div>
  );
};

/* ──────────────────────────────────────────
   📈 Count-up hook
────────────────────────────────────────── */
const useCountUp = (target, duration = 1200) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const t = parseFloat(target) || 0;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(+(t * (1 - Math.pow(1 - p, 3))).toFixed(typeof target === 'string' && target.includes('.') ? 2 : 0));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return val;
};

/* ──────────────────────────────────────────
   🃏 KPI Card
────────────────────────────────────────── */
const KPICard = ({ icon, label, value, sub, gradient, glow }) => {
  const animated = useCountUp(parseFloat(value) || 0);
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white/[0.05] border border-white/[0.08] backdrop-blur-xl rounded-2xl p-5 relative overflow-hidden"
      style={{ boxShadow: `0 0 30px -15px ${glow}` }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -translate-y-4 translate-x-4 pointer-events-none opacity-20"
        style={{ background: glow }} />
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}>
        <span className="text-white text-sm">{icon}</span>
      </div>
      <p className="text-slate-500 text-xs font-medium mb-1">{label}</p>
      <p className="text-2xl font-black text-white tabular-nums">{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </motion.div>
  );
};

/* ──────────────────────────────────────────
   🌡️ Live condition tile
────────────────────────────────────────── */
const CondTile = ({ icon, label, value, color = 'text-white' }) => (
  <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
    <span className="text-lg">{icon}</span>
    <p className="text-slate-500 text-xs">{label}</p>
    <p className={`font-bold text-sm ${color}`}>{value}</p>
  </div>
);

/* ──────────────────────────────────────────
   📋 Claim timeline step
────────────────────────────────────────── */
const TimelineStep = ({ icon, label, desc, done, active, last }) => (
  <div className="flex gap-3 relative">
    {!last && (
      <div className="absolute left-4 top-8 bottom-0 w-px bg-gradient-to-b from-blue-500/30 to-transparent" />
    )}
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-sm transition-all ${
      done   ? 'bg-green-500 shadow-lg shadow-green-500/40' :
      active ? 'bg-blue-500 shadow-lg shadow-blue-500/40 animate-pulse' :
               'bg-white/[0.06] border border-white/[0.1]'
    }`}>
      {done ? <CheckCircle className="w-4 h-4 text-white" /> : <span>{icon}</span>}
    </div>
    <div className="pb-5">
      <p className={`text-sm font-bold ${done ? 'text-green-300' : active ? 'text-blue-300' : 'text-slate-500'}`}>{label}</p>
      <p className="text-slate-600 text-xs">{desc}</p>
    </div>
  </div>
);

/* ──────────────────────────────────────────
   🚨 Simulation button
────────────────────────────────────────── */
const SimButton = ({ label, icon, type, onClick, active, disabled }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={() => onClick(type, label)}
    disabled={disabled}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
      active
        ? 'bg-blue-500/20 border-blue-400/40 text-blue-300'
        : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08]'
    } disabled:opacity-40 disabled:cursor-not-allowed`}
  >
    <span>{icon}</span>{label}
  </motion.button>
);

/* ──────────────────────────────────────────
   🍞 Toast notification
────────────────────────────────────────── */
const Toast = ({ toast }) => (
  <AnimatePresence>
    {toast && (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-[100] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold backdrop-blur-xl border ${
          toast.type === 'success'
            ? 'bg-green-500/20 border-green-400/40 text-green-200'
            : toast.type === 'error'
            ? 'bg-red-500/20 border-red-400/40 text-red-200'
            : 'bg-blue-500/20 border-blue-400/40 text-blue-200'
        }`}
      >
        {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
        {toast.message}
      </motion.div>
    )}
  </AnimatePresence>
);

/* ══════════════════════════════════════════
   🏠 MAIN DASHBOARD
══════════════════════════════════════════ */
const Dashboard = ({ user, riskData, currentLocation, dailyIncome, selectedPlan, policyData, onLogout }) => {
  const [liveData, setLiveData] = useState({
    weather: 'Clear', temperature: 28, aqi: 85, orderDrop: 0, rainIntensity: 0, riskScore: 0.15
  });
  const [triggers, setTriggers] = useState([]);
  const [claimHistory, setClaimHistory] = useState([]);
  const [claimStats, setClaimStats] = useState(null);
  const [activeTab, setActiveTab] = useState('monitor');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulation, setSimulation] = useState(null);
  const [toast, setToast] = useState(null);
  const [claimStep, setClaimStep] = useState(0); // 0=idle,1=detected,2=verifying,3=paid

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchClaimHistory();
      fetchClaimStats();
    }
    // Seed liveData from riskData
    if (riskData) {
      setLiveData(prev => ({
        ...prev,
        weather: riskData.weather?.condition || riskData.weather?.weather || 'Clear',
        temperature: riskData.weather?.temperature || 28,
        aqi: riskData.aqi || 85,
        riskScore: riskData.riskScore || 0.15,
        orderDrop: riskData.orderDrop || 0,
        rainIntensity: riskData.weather?.rainInLastHour || 0
      }));
    }
  }, [user?.id]);

  const fetchClaimHistory = async () => {
    try {
      const res = await fetch(`${API}/claim/user/${user.id}`);
      const data = await res.json();
      if (data.success) setClaimHistory(data.claims || []);
    } catch {}
  };

  const fetchClaimStats = async () => {
    try {
      const res = await fetch(`${API}/claim/stats/${user.id}`);
      const data = await res.json();
      if (data.success) setClaimStats(data.stats);
    } catch {}
  };

  const simulateScenario = async (type, label) => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulation(type);

    try {
      const simRes = await fetch(`${API}/trigger/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, location: currentLocation, userId: user?.id })
      });
      const simData = await simRes.json();
      const scenario = simData.data?.scenario || {};
      const triggerResult = simData.data?.triggerResult || {};

      setLiveData(prev => ({
        ...prev,
        weather: type === 'rain' ? 'Rain' : type === 'heat' ? 'Clear' : prev.weather,
        temperature: scenario.temperature || prev.temperature,
        aqi: scenario.aqi || prev.aqi,
        orderDrop: scenario.orderDrop || 0,
        rainIntensity: scenario.rain || 0,
        riskScore: Math.min((scenario.rain || 0) * 0.025 + (scenario.aqi || 0) / 2500 + (scenario.orderDrop || 0) / 100, 1)
      }));

      if (triggerResult.triggered) {
        const primary = triggerResult.primaryTrigger;
        setTriggers(prev => [{
          id: Date.now(),
          reason: primary?.reason || label,
          triggerType: primary?.triggerType || type,
          severity: primary?.severity || 'HIGH',
          time: new Date()
        }, ...prev.slice(0, 4)]);

        // Animate claim timeline
        setClaimStep(1);
        showToast(`⚡ Trigger detected: ${primary?.reason || label}`, 'info');

        await processAutoClaim(scenario, triggerResult.primaryTrigger);
      } else {
        showToast(`✅ No trigger — conditions are within safe limits`, 'success');
      }
    } catch (err) {
      showToast('❌ Simulation failed — check backend connection', 'error');
    } finally {
      setIsSimulating(false);
      setTimeout(() => setSimulation(null), 3000);
    }
  };

  const processAutoClaim = async (scenario, trigger) => {
    await new Promise(r => setTimeout(r, 800));
    setClaimStep(2);

    try {
      const res = await fetch(`${API}/claim/auto-process`, {
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
            orderDrop: scenario?.orderDrop || liveData.orderDrop,
            humidity: 70
          }
        })
      });
      const claimData = await res.json();

      await new Promise(r => setTimeout(r, 1000));
      setClaimStep(3);

      if (claimData.success) {
        fetchClaimHistory();
        fetchClaimStats();
        showToast(`💰 ₹${claimData.claim?.amount} credited to your UPI!`, 'success');
      }
    } catch {
      setClaimStep(3);
      showToast(`💰 Demo: ₹${Math.round((dailyIncome || 600) * 0.6)} auto-credited!`, 'success');
    }

    setTimeout(() => setClaimStep(0), 5000);
  };

  const weeklyPremium = selectedPlan?.weeklyPremium || 99;
  const coverage = selectedPlan?.coverage || 5000;
  const location = riskData?.weather?.city || currentLocation || 'Mumbai';

  const tabs = [
    { id: 'monitor', label: 'Live Monitor', icon: Activity },
    { id: 'simulate', label: 'Simulate', icon: Zap },
    { id: 'claims', label: 'Claims', icon: CheckCircle },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'radial-gradient(ellipse 60% 40% at 20% 10%, rgba(99,102,241,0.12) 0%, transparent 50%), radial-gradient(ellipse 40% 30% at 80% 80%, rgba(59,130,246,0.08) 0%, transparent 50%), #050814'
      }}
    >
      <Toast toast={toast} />

      {/* ── Top Nav ─────────────────────────── */}
      <div className="sticky top-0 z-40 bg-[#050814]/80 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm">GigRakshak <span className="text-blue-400">AI</span></span>
            <span className="hidden sm:flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/20 text-green-400 text-xs font-semibold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
              </span>
              Protected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-xs">
              <span className="text-slate-600">📍</span>
              <span>{location}</span>
            </div>
            <div className="w-px h-4 bg-white/[0.08] hidden sm:block mx-1" />
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-xs">
              <span className="font-medium text-white">{user?.name || user?.email?.split('@')[0] || 'Worker'}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all text-xs font-medium"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── KPI cards row ────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon="🛡️" label="Weekly Coverage" value={`₹${coverage.toLocaleString()}`}
            sub={`${selectedPlan?.name || 'Standard'} Plan`}
            gradient="from-blue-500 to-indigo-600" glow="rgba(99,102,241,0.5)" />
          
          <motion.div
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="bg-white/[0.05] border border-white/[0.08] backdrop-blur-xl rounded-2xl p-5 relative overflow-hidden"
            style={{ boxShadow: `0 0 30px -15px rgba(6,182,212,0.5)` }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -translate-y-4 translate-x-4 pointer-events-none opacity-20"
              style={{ background: 'rgba(6,182,212,0.5)' }} />
            <div className="flex justify-between items-start">
              <div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-3">
                  <span className="text-white text-sm">💸</span>
                </div>
                <p className="text-slate-500 text-xs font-medium mb-1">Weekly Premium</p>
                <p className="text-2xl font-black text-white tabular-nums">₹{weeklyPremium}</p>
                <p className="text-slate-500 text-xs mt-1">Auto-renewed each week</p>
              </div>
              <button 
                onClick={() => window.location.href = '/onboarding'}
                className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/20 hover:text-white transition-all z-10"
              >
                View Plans
              </button>
            </div>
          </motion.div>
          <KPICard icon="✅" label="Claims Paid" value={`₹${(claimStats?.totalPayouts || 0).toLocaleString()}`}
            sub={`${claimStats?.totalClaims || 0} total claims`}
            gradient="from-emerald-500 to-green-600" glow="rgba(16,185,129,0.5)" />
          <KPICard icon="⚡" label="Avg Payout" value={claimStats?.avgProcessingTime || '< 3s'}
            sub="From trigger to UPI"
            gradient="from-violet-500 to-purple-600" glow="rgba(139,92,246,0.5)" />
        </div>

        {/* ── Main content ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left — Risk meter + conditions */}
          <div className="space-y-4">

            {/* Risk meter card */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-4">Live Risk Score</p>
              <div className="flex items-center gap-4">
                <RiskMeter score={liveData.riskScore} />
                <div className="space-y-2 flex-1 min-w-0">
                  <div>
                    <p className="text-slate-500 text-xs">Location</p>
                    <p className="text-white text-sm font-semibold truncate">📍 {location}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Plan</p>
                    <p className="text-blue-300 text-sm font-bold">{selectedPlan?.name || 'Standard'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Income Protection</p>
                    <p className="text-emerald-300 text-sm font-bold">{selectedPlan?.incomeProtection || 60}%</p>
                  </div>
                </div>
              </div>

              {/* AI explanation */}
              <div className="mt-4 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-slate-400 leading-relaxed">
                <span className="text-blue-400 font-semibold">🧠 AI: </span>
                {liveData.riskScore > 0.7
                  ? `Risk is HIGH — heavy rain (${liveData.rainIntensity.toFixed(1)}mm/h) combined with poor AQI (${Math.round(liveData.aqi)}) are impacting delivery conditions.`
                  : liveData.riskScore > 0.4
                  ? `Risk is MODERATE — weather conditions may affect deliveries. AQI at ${Math.round(liveData.aqi)} and ${Math.round(liveData.orderDrop)}% order drop expected.`
                  : `Risk is LOW — conditions are safe. Weather clear, AQI acceptable at ${Math.round(liveData.aqi)}.`
                }
              </div>
            </div>

            {/* Live conditions grid */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-4">Live Conditions</p>
              <div className="grid grid-cols-2 gap-2">
                <CondTile icon="🌤️" label="Weather" value={liveData.weather} color="text-sky-300" />
                <CondTile icon="🌡️" label="Temperature" value={`${Math.round(liveData.temperature)}°C`} color="text-orange-300" />
                <CondTile icon="🌫️" label="AQI" value={Math.round(liveData.aqi)} color={liveData.aqi > 200 ? 'text-red-400' : liveData.aqi > 100 ? 'text-yellow-400' : 'text-green-400'} />
                <CondTile icon="📉" label="Order Drop" value={`${Math.round(liveData.orderDrop)}%`} color={liveData.orderDrop > 30 ? 'text-red-400' : 'text-slate-200'} />
                <CondTile icon="🌧️" label="Rain/hr" value={`${liveData.rainIntensity.toFixed(1)} mm`} color="text-blue-300" />
                <CondTile icon="⏰" label="Time" value={new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} color="text-slate-200" />
              </div>
            </div>
          </div>

          {/* Center + Right — tabs */}
          <div className="lg:col-span-2 space-y-4">

            {/* Tab bar */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.07] rounded-xl w-fit">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-white/[0.08] text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />{tab.label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">

              {/* TAB: Live Monitor */}
              {activeTab === 'monitor' && (
                <motion.div key="monitor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                  {/* Triggers feed */}
                  <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 mb-4">
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-white font-bold text-sm flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" /> Active Triggers
                      </p>
                      <span className="text-xs text-slate-500">5 parametric events monitored</span>
                    </div>

                    {triggers.length === 0 ? (
                      <div className="text-center py-10">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-3">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <p className="text-slate-400 text-sm font-semibold">All Clear</p>
                        <p className="text-slate-600 text-xs mt-1">No triggers fired. Simulate a scenario to test the system.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {triggers.map((t, i) => (
                          <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20"
                          >
                            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-red-200 text-sm font-semibold">{t.reason}</p>
                              <p className="text-slate-500 text-xs mt-0.5">
                                {t.triggerType} · {t.severity} · {new Date(t.time).toLocaleTimeString()}
                              </p>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold">FIRED</span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Parametric triggers info */}
                  <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5">
                    <p className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-400" /> Protected Against
                    </p>
                    <div className="space-y-2">
                      {[
                        { icon: '🌧️', label: 'Heavy Rain', threshold: 'Rain > 5mm/hr', status: liveData.rainIntensity > 5 },
                        { icon: '🔥', label: 'Extreme Heat', threshold: 'Temp > 42°C', status: liveData.temperature > 42 },
                        { icon: '🌫️', label: 'Poor Air Quality', threshold: 'AQI > 200', status: liveData.aqi > 200 },
                        { icon: '📉', label: 'Severe Order Drop', threshold: 'Drop > 30%', status: liveData.orderDrop > 30 },
                        { icon: '🚫', label: 'Social Disruption', threshold: 'Bandh/Curfew detected', status: false },
                      ].map((t, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{t.icon}</span>
                            <div>
                              <p className="text-slate-200 text-xs font-semibold">{t.label}</p>
                              <p className="text-slate-600 text-xs">{t.threshold}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                            t.status
                              ? 'bg-red-500/20 border-red-500/30 text-red-300'
                              : 'bg-green-500/10 border-green-500/20 text-green-400'
                          }`}>
                            {t.status ? 'ACTIVE' : 'Safe'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB: Simulate */}
              {activeTab === 'simulate' && (
                <motion.div key="simulate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
                    <p className="text-white font-bold mb-1 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" /> Disruption Simulator
                    </p>
                    <p className="text-slate-500 text-xs mb-6">Fire real parametric triggers and watch the auto-claim system respond in real-time.</p>

                    <div className="flex flex-wrap gap-2.5 mb-7">
                      {[
                        { type: 'rain', label: 'Heavy Rain',       icon: '🌧️' },
                        { type: 'heat', label: 'Extreme Heat',      icon: '🔥' },
                        { type: 'aqi',  label: 'Poor AQI',          icon: '🌫️' },
                        { type: 'order_drop', label: 'Order Drop',  icon: '📉' },
                        { type: 'bandh', label: 'Social Disruption',icon: '🚫' },
                      ].map(s => (
                        <SimButton key={s.type} {...s} onClick={simulateScenario}
                          active={simulation === s.type} disabled={isSimulating} />
                      ))}
                    </div>

                    {/* Claim timeline */}
                    <div className="border-t border-white/[0.06] pt-6">
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">Auto-Claim Timeline</p>
                      <div className="pl-1">
                        <TimelineStep icon="⚡" label="Trigger Detected" desc="Parametric threshold breached" done={claimStep > 1} active={claimStep === 1} />
                        <TimelineStep icon="🧠" label="AI Verification" desc="Fraud check + weather cross-validation" done={claimStep > 2} active={claimStep === 2} />
                        <TimelineStep icon="💰" label="Payout Initiated" desc="UPI credit within 3 seconds" done={claimStep > 3} active={claimStep === 3} last />
                      </div>

                      {claimStep === 0 && (
                        <p className="text-slate-600 text-xs mt-3 pl-1">Simulate a disruption above to see the real-time claim flow.</p>
                      )}

                      {isSimulating && (
                        <div className="mt-4 flex items-center gap-2 text-blue-300 text-xs font-medium">
                          <div className="w-3.5 h-3.5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                          Processing scenario...
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB: Claims */}
              {activeTab === 'claims' && (
                <motion.div key="claims" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-white font-bold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" /> Claim History
                      </p>
                      <button onClick={fetchClaimHistory} className="text-slate-500 hover:text-slate-300 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Stats mini row */}
                    {claimStats && (
                      <div className="grid grid-cols-3 gap-3 mb-5">
                        {[
                          { label: 'Total Paid', value: `₹${(claimStats.totalPayouts || 0).toLocaleString()}`, color: 'text-green-300' },
                          { label: 'Claims', value: claimStats.totalClaims || 0, color: 'text-white' },
                          { label: 'Success Rate', value: `${claimStats.successRate || 100}%`, color: 'text-blue-300' },
                        ].map((s, i) => (
                          <div key={i} className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.05] text-center">
                            <p className={`font-black text-lg ${s.color}`}>{s.value}</p>
                            <p className="text-slate-600 text-xs mt-0.5">{s.label}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {claimHistory.length === 0 ? (
                      <div className="text-center py-14">
                        <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                          <BarChart2 className="w-6 h-6 text-blue-400" />
                        </div>
                        <p className="text-slate-400 font-semibold">No claims yet</p>
                        <p className="text-slate-600 text-xs mt-2 max-w-xs mx-auto">
                          Simulate a disruption event in the Simulate tab to trigger a demo claim.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                        {claimHistory.map((c, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className={`p-4 rounded-xl border flex justify-between items-start ${
                              c.status === 'APPROVED'
                                ? 'bg-green-500/10 border-green-500/20'
                                : c.status === 'PENDING'
                                ? 'bg-yellow-500/10 border-yellow-500/20'
                                : 'bg-white/[0.04] border-white/[0.07]'
                            }`}
                          >
                            <div>
                              <p className="text-white text-sm font-bold">₹{c.amount} — {c.status}</p>
                              <p className="text-slate-400 text-xs mt-0.5">{c.triggerType} · Fraud: {c.fraudScore}</p>
                              <p className="text-slate-600 text-xs mt-0.5">{new Date(c.createdAt).toLocaleDateString('en-IN')}</p>
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              c.status === 'APPROVED' ? 'bg-green-500/20 text-green-300' :
                              c.status === 'PENDING'  ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-slate-500/20 text-slate-400'
                            }`}>{c.status}</span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Footer info ──────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-700 py-4 border-t border-white/[0.04]">
          <span>GigRakshak AI v2.0</span>
          <span>•</span>
          <span>Real-time parametric insurance</span>
          <span>•</span>
          <span>Powered by OpenWeatherMap + AI</span>
          <span>•</span>
          <span>{new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
