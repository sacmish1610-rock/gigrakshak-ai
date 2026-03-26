import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

const RiskCard = ({ riskData, onReset }) => {
  const getRiskConfig = (level) => {
    switch (level) {
      case 'LOW':
        return {
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: <ShieldCheck className="w-12 h-12 text-green-500" />,
          gradient: 'from-green-500 to-emerald-600',
          message: 'Safe conditions detected. Have a great day!',
        };
      case 'MEDIUM':
        return {
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
          gradient: 'from-yellow-400 to-orange-500',
          message: 'Moderate risk detected. Consider upgrading your plan.',
        };
      case 'HIGH':
        return {
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: <ShieldAlert className="w-12 h-12 text-red-500" />,
          gradient: 'from-red-500 to-rose-600',
          message: 'High risk detected in your area. We recommend the PRO plan this week.',
        };
      default:
        return {
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: <ShieldCheck className="w-12 h-12 text-gray-500" />,
          gradient: 'from-gray-500 to-slate-600',
          message: 'Assessing conditions...',
        };
    }
  };

  const config = getRiskConfig(riskData.level);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, type: "spring" }}
      className={`rounded-2xl border ${config.border} bg-white/80 backdrop-blur-xl shadow-xl overflow-hidden`}
    >
      {/* Header bar */}
      <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />
      
      <div className="p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`p-4 rounded-full ${config.bg}`}
          >
            {config.icon}
          </motion.div>

          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Risk Level
            </h2>
            <div className={`text-4xl font-black ${config.color} tracking-tight`}>
              {riskData.level}
            </div>
            
            <div className="flex items-center justify-center mt-3 space-x-2">
              <span className="text-gray-600 text-lg">Score:</span>
              <span className={`text-2xl font-bold ${config.color}`}>
                {riskData.riskScore}
                <span className="text-sm text-gray-400 font-normal">/100</span>
              </span>
            </div>
          </div>

          <div className={`w-full p-4 rounded-xl ${config.bg} border ${config.border} flex items-start text-left space-x-3`}>
            {riskData.level === 'HIGH' ? <AlertTriangle className={`w-6 h-6 shrink-0 mt-0.5 ${config.color}`} /> : (riskData.level === 'LOW' ? <CheckCircle2 className={`w-6 h-6 shrink-0 mt-0.5 ${config.color}`} /> : <AlertTriangle className={`w-6 h-6 shrink-0 mt-0.5 ${config.color}`} />)}
            <p className={`text-sm font-medium ${config.color}`}>
              {config.message}
            </p>
          </div>

          <div className="w-full pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-3">AI Recommended Plan</p>
            <div className={`py-3 px-6 rounded-lg text-white font-bold bg-gradient-to-r ${config.gradient} shadow-lg flex items-center justify-center space-x-2`}>
              <Zap className="w-5 h-5" />
              <span className="text-lg">{riskData.recommendation} tier</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Check another location
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default RiskCard;
