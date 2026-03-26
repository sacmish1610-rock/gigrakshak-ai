import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';
import LiveStatsPanel from '../components/LiveStatsPanel';
import TriggerAlert from '../components/TriggerAlert';
import ClaimSuccessCard from '../components/ClaimSuccessCard';

const getSimulatedData = () => ({
  rain: Math.floor(Math.random() * 80) + 10,  
  aqi: Math.floor(Math.random() * 200) + 50,  
  orderDrop: Math.floor(Math.random() * 20) + 5,
  peakHours: Math.random() > 0.5,
  social: false
});

const getExtremeData = () => ({
  rain: Math.floor(Math.random() * 50) + 100, 
  aqi: Math.floor(Math.random() * 100) + 300, 
  orderDrop: Math.floor(Math.random() * 30) + 50, 
  peakHours: true,
  social: false
});

const LiveMonitor = ({ onBack }) => {
  const [data, setData] = useState(getSimulatedData());
  const [status, setStatus] = useState('monitoring'); // monitoring, triggering, done
  const [triggerReason, setTriggerReason] = useState('');
  const [payoutAmount, setPayoutAmount] = useState(800);
  
  const tickRef = useRef(0);

  useEffect(() => {
    let interval;
    if (status === 'monitoring') {
      interval = setInterval(async () => {
        tickRef.current++;
        
        // At tick 4 (after ~12s), simulate a spike in parameters
        const isSpike = tickRef.current >= 4; 
        const nextData = isSpike ? getExtremeData() : getSimulatedData();
        setData(nextData);

        try {
          const res = await fetch('http://localhost:5000/api/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nextData)
          });
          
          let result = { triggered: false };
          if (res.ok) {
             result = await res.json();
          } else {
             result = isSpike ? { triggered: true, reason: "Severe Rainfall & Traffic Density Threshold Exceeded (>100mm/h)" } : { triggered: false };
          }

          if (result.triggered) {
            setStatus('triggering');
            setTriggerReason(result.reason || "Severe weather conditions detected locking earning potential.");
          }

        } catch (err) {
          console.error(err);
          // Fallback simulation for live demonstration
          if (isSpike) {
            setStatus('triggering');
            setTriggerReason("Severe Rainfall & Traffic Density Threshold Exceeded (>100mm/h)");
          }
        }
      }, 3000); // UI poll loop
    }

    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status === 'triggering') {
      // Transition from alert to auto-claim automatically after 4 seconds
      const timer = setTimeout(async () => {
        try {
          await fetch('http://localhost:5000/api/claim', { method: 'POST' });
        } catch (e) {
          console.warn("Claim endpoint fallback", e);
        }
        setStatus('done');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);


  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden w-full flex flex-col items-center text-slate-200">
      
      {/* Dark mode background elements with neon tints */}
      <div className="fixed inset-0 bg-[#020617] -z-20" />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-cyan-900/20 blur-[120px] rounded-full -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-900/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-6xl mx-auto px-6 py-6 sm:py-8 flex items-center justify-between z-10">
         <button 
           onClick={onBack}
           className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
         >
           ← Back
         </button>
         <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-full">
           <span className="relative flex h-2 w-2">
             <span className={(status === 'monitoring' ? "animate-ping " : "") + "absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"}></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
           </span>
           <span className="text-cyan-400 font-mono text-sm tracking-widest font-bold">LIVE NETWORK</span>
         </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-20 flex-1 flex flex-col items-center justify-center relative z-10">
        
        <div className="text-center mb-12">
          <motion.div 
            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 shadow-xl mb-6 shadow-cyan-900/20 border border-cyan-900/50"
          >
            <Activity className="w-8 h-8 text-cyan-400" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            Parametric Risk Engine
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Real-time telemetry monitoring external variables. If conditions exceed your insured thresholds, payout is instant—zero touch.
          </p>
        </div>

        <LiveStatsPanel data={data} />

        <div className="w-full mt-4 min-h-[300px] flex justify-center items-start">
           <AnimatePresence mode="wait">
             {status === 'triggering' && (
                <motion.div key="alert" exit={{ opacity: 0, y: 20 }} className="w-full">
                  <TriggerAlert reason={triggerReason} />
                </motion.div>
             )}

             {status === 'done' && (
                <motion.div key="claim" exit={{ opacity: 0, y: 20 }} className="w-full">
                  <ClaimSuccessCard amount={payoutAmount} />
                </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

    </div>
  );
};

export default LiveMonitor;
