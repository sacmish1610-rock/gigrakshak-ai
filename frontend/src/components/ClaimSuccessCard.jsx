import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Banknote, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

const ClaimSuccessCard = ({ amount = 800 }) => {
  useEffect(() => {
    // Fire confetti!
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#047857', '#34d399', '#fde047']
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#047857', '#34d399', '#fde047']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="w-full max-w-2xl mx-auto mt-8 bg-emerald-950/40 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-emerald-500/5" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
      
      <div className="relative z-10 flex flex-col items-center flex-col text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.5)]"
        >
          <Banknote className="w-12 h-12 text-slate-950" strokeWidth={2.5} />
        </motion.div>
        
        <h2 className="text-4xl font-black text-emerald-400 tracking-tight mb-2">
          💰 ₹{amount} Payout Initiated
        </h2>
        <p className="text-xl text-emerald-200/80 font-medium mb-8">
          Funds are en route to your registered bank account instantly based on the parametric trigger. No manual claims required.
        </p>

        <div className="w-full bg-slate-900/50 border border-emerald-900/50 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center text-emerald-500 font-bold">
             <ShieldCheck className="w-6 h-6 mr-3 text-emerald-400" />
             Zero-Touch Auto Claim
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-mono text-sm tracking-widest font-bold">SETTLED</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClaimSuccessCard;
