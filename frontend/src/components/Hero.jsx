import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react';

const Hero = ({ onGetStarted }) => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Dynamic Backgrounds */}
      <div className="absolute inset-0 bg-[#f8fafc] -z-20" />
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-400/30 to-teal-500/30 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '10s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-blue-100 backdrop-blur-sm mb-8 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-ping absolute"></span>
            <span className="flex h-2 w-2 rounded-full bg-green-500 relative"></span>
            <span className="text-sm font-semibold text-slate-700 ml-2">Smart Risk API v1.0 Live</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight"
          >
            Protecting Every Delivery, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Securing Every Earning.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            An AI-powered parametric insurance platform built specifically for the modern gig economy. Automated claims, real-time risk API, and instant payouts.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={onGetStarted}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
            <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg shadow-sm transition-all hover:-translate-y-1">
              Read API Docs
            </button>
          </motion.div>
        </div>

        {/* Floating Abstract Dashboard Element */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
           className="mt-20 mx-auto max-w-5xl relative"
        >
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f8fafc] z-10 top-1/2 rounded-b-3xl" />
           <div className="bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-t-3xl p-4 sm:p-6 pb-0 overflow-hidden relative">
              <div className="w-full h-12 flex flex-row items-center justify-start gap-2 px-4 border-b border-black/5 mb-4">
                 <div className="w-3 h-3 rounded-full bg-red-400" />
                 <div className="w-3 h-3 rounded-full bg-yellow-400" />
                 <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
                 
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                       <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-slate-900 font-bold mb-1">Instant Parametric Trigger</h3>
                    <p className="text-slate-500 text-sm">Automated payout system triggering when risk thresholds are met.</p>
                 </div>
                 
                 <div className="bg-white rounded-2xl p-6 shadow-md shadow-blue-500/5 border-2 border-blue-50 relative -translate-y-4">
                    <div className="absolute -top-3 -right-3">
                       <span className="flex h-6 w-6">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-500 border-2 border-white"></span>
                       </span>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                       <Activity className="w-6 h-6" />
                    </div>
                    <h3 className="text-slate-900 font-bold mb-1">Real-time Risk AI</h3>
                    <p className="text-slate-500 text-sm">Ingests dynamic rain, AQI, and external context via /api/risk</p>
                 </div>

                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                       <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-slate-900 font-bold mb-1">Smart Underwriting</h3>
                    <p className="text-slate-500 text-sm">Gig-specific precision pricing powered by advanced ML models.</p>
                 </div>

              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;