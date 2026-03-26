import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Shield } from 'lucide-react';

const PlanCard = ({ plan, isSelected, onSelect }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(plan)}
      className={`relative cursor-pointer rounded-3xl p-6 transition-all duration-300 border backdrop-blur-xl
        ${isSelected 
          ? 'bg-blue-50/90 border-blue-400 shadow-2xl shadow-blue-500/20' 
          : 'bg-white/60 border-slate-200 hover:border-blue-200 shadow-lg shadow-slate-200/50'
        }`}
    >
      {isSelected && (
        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-blue-400 to-indigo-500 opacity-20 blur-sm pointer-events-none" />
      )}
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl scale-90 ${isSelected ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-slate-100 text-slate-500'}`}>
              <Shield className="w-5 h-5" />
            </div>
            <h3 className={`text-xl font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
              {plan.name}
            </h3>
          </div>
          {isSelected && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <CheckCircle2 className="w-6 h-6 text-blue-500" />
            </motion.div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-end gap-1 mb-1">
            <span className="text-3xl font-black text-slate-900">₹{plan.premium}</span>
            <span className="text-sm text-slate-500 font-medium mb-1">/ week</span>
          </div>
          <p className="text-sm font-medium text-slate-500">
            Coverage upto <span className={`font-bold ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>₹{plan.coverage}</span>
          </p>
        </div>

        <ul className="space-y-3">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start text-sm text-slate-600 font-medium">
              <CheckCircle2 className={`w-4 h-4 mr-2 mt-0.5 shrink-0 ${isSelected ? 'text-blue-500' : 'text-slate-300'}`} />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default PlanCard;
