import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, BarChart3, Clock } from 'lucide-react';
import heroBg from '../assets/images/hero-bg.png';

/* ── Trust badge ──────────────────────── */
const TrustBadge = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-slate-200/50 text-slate-700 text-sm font-medium shadow-sm">
    <Icon className="w-4 h-4 text-blue-600" />
    <span>{label}</span>
  </div>
);

const Hero = ({ onGetStarted }) => {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };
  const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } } };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 overflow-hidden bg-slate-50">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-no-repeat bg-cover bg-center lg:bg-right"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        {/* Gradients to ensure text readability on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent sm:w-2/3 md:w-1/2 lg:w-[55%] z-0" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 to-transparent z-0" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Left Content Area (Text) */}
        <div className="w-full lg:w-[55%] pt-10 lg:pt-0 pb-10">
          
          {/* Live badge */}
          <motion.div variants={item} className="flex justify-start mb-6">
            <div className="relative flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm font-bold text-blue-700 tracking-wide uppercase">AI Risk Engine Live</span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={item}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6"
          >
            Income Protection
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              When You Need It Most
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-xl"
          >
            Smart parametric insurance for gig workers. <strong className="text-slate-800 font-semibold">Zero paperwork.</strong> Instant payouts triggered automatically by severe weather, high AQI, or platform disruptions.
          </motion.p>

          {/* Trust badges */}
          <motion.div variants={item} className="flex flex-wrap items-center gap-3 mb-10 max-w-md">
            <TrustBadge icon={Zap} label="Instant Claims" />
            <TrustBadge icon={ShieldCheck} label="Zero Paperwork" />
            <TrustBadge icon={BarChart3} label="Data-Driven Triggers" />
          </motion.div>

          {/* CTA buttons */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4">
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all"
            >
              Get Protected Now <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
            >
              See How It Works
            </motion.button>
          </motion.div>
          
          <motion.div variants={item} className="mt-8 flex items-center gap-4 text-sm font-medium text-slate-500">
             <div className="flex -space-x-2">
               <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://i.pravatar.cc/100?img=11" alt=""/>
               <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://i.pravatar.cc/100?img=12" alt=""/>
               <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://i.pravatar.cc/100?img=15" alt=""/>
             </div>
             <p>Trusted by <span className="text-slate-800 font-bold">10,000+</span> delivery partners</p>
          </motion.div>
        </div>
        
        {/* Right Content Area (Image placeholder for small screens if needed, otherwise handled by background) */}
        {/* In the desktop layout, the right side of the background image will naturally show here */}
        <div className="hidden lg:block lg:w-[45%] h-full"></div>
      </motion.div>
    </section>
  );
};

export default Hero;