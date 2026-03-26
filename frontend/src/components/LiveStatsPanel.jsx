import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Wind, TrendingDown, Clock, Users } from 'lucide-react';

const StatBox = ({ title, value, unit, icon: Icon, colorClass, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 relative overflow-hidden"
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${colorClass}`} />
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl bg-slate-800/80 ${colorClass.replace('bg-', 'text-')}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
    <div className="flex items-baseline gap-1">
      <motion.span 
        key={value}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-3xl font-bold text-slate-100 font-mono tracking-tight"
      >
        {value}
      </motion.span>
      <span className="text-slate-500 font-medium">{unit}</span>
    </div>
  </motion.div>
);

const LiveStatsPanel = ({ data }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto z-10 relative">
      <StatBox 
        title="Rainfall Intensity" 
        value={data.rain} 
        unit="mm/h" 
        icon={CloudRain} 
        colorClass="bg-blue-500" 
        delay={0.1} 
      />
      <StatBox 
        title="Air Quality (AQI)" 
        value={data.aqi} 
        unit="Index" 
        icon={Wind} 
        colorClass="bg-red-500" 
        delay={0.2} 
      />
      <StatBox 
        title="Order Drop" 
        value={data.orderDrop} 
        unit="%" 
        icon={TrendingDown} 
        colorClass="bg-orange-500" 
        delay={0.3} 
      />
      <StatBox 
        title="Peak Hours" 
        value={data.peakHours ? "YES" : "NO"} 
        unit="" 
        icon={Clock} 
        colorClass={data.peakHours ? "bg-emerald-500" : "bg-slate-500"} 
        delay={0.4} 
      />
      <StatBox 
        title="Social Unrest Risk" 
        value={data.social ? "HIGH" : "LOW"} 
        unit="" 
        icon={Users} 
        colorClass={data.social ? "bg-fuchsia-500" : "bg-slate-500"} 
        delay={0.5} 
      />
    </div>
  );
};

export default LiveStatsPanel;
