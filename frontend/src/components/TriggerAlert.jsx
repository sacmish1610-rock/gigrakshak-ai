import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap } from 'lucide-react';

const TriggerAlert = ({ reason }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mt-8 bg-red-950/40 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.4)]"
        >
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </motion.div>
        
        <h2 className="text-3xl font-black text-red-500 tracking-tight mb-2 flex items-center gap-2">
          🚨 Income Loss Detected
        </h2>
        <p className="text-xl text-red-200/80 font-medium mb-6">
          {reason}
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-950/50 border border-red-900/50 rounded-full text-red-400 text-sm font-bold shadow-lg shadow-red-900/20">
          <Zap className="w-4 h-4 animate-pulse" />
          Smart Contract Triggered
        </div>
      </div>
    </motion.div>
  );
};

export default TriggerAlert;
