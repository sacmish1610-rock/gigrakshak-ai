import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, CloudRain, Clock, Wind } from 'lucide-react';
import InputForm from '../components/InputForm';
import RiskCard from '../components/RiskCard';

const Onboarding = () => {
  const [formData, setFormData] = useState({
    location: '',
    income: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyzeRisk = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate realistic inputs
      const simulatedPayload = {
        rain: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
        aqi: Math.floor(Math.random() * (400 - 100 + 1)) + 100,
        orderDrop: Math.floor(Math.random() * (50 - 10 + 1)) + 10,
        peakHours: true
      };

      const response = await fetch('http://localhost:5000/api/risk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(simulatedPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze risk');
      }

      const data = await response.json();
      
      setTimeout(() => {
        setResult(data);
        setIsLoading(false);
      }, 1500);

    } catch (err) {
      console.error('Error analyzing risk:', err);
      setError('Unable to reach AI server. Using simulated results.');
      // Fallback for demo showing a High Risk scenario
      setTimeout(() => {
        setResult({
           riskScore: 85,
           level: 'HIGH',
           recommendation: 'Pro'
        });
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData({ location: '', income: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100 to-transparent -z-10" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-lg mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl mb-6 shadow-blue-500/20 border border-blue-100"
          >
            <Shield className="w-8 h-8 text-blue-600" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Smart AI Onboarding
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-slate-600"
          >
            Real-time, AI-driven risk assessment for Gig workers.
          </motion.p>
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-10 relative"
            >
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-800 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-500" />
                  Risk Assessment
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  Enter your shift details and let our AI calculate live external risks.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-200 text-sm text-orange-700 font-medium">
                  {error}
                </div>
              )}

              <InputForm 
                formData={formData} 
                setFormData={setFormData} 
                onSubmit={handleAnalyzeRisk} 
                isLoading={isLoading} 
              />
              
              {/* Feature hints */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span className="flex items-center"><CloudRain className="w-4 h-4 mr-1 text-blue-400" /> Weather</span>
                <span className="flex items-center"><Wind className="w-4 h-4 mr-1 text-teal-400" /> AQI Stats</span>
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-indigo-400" /> Volatility</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
            >
              <RiskCard riskData={result} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
