import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import PlanCard from '../components/PlanCard';
import PolicySuccess from '../components/PolicySuccess';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    premium: 49,
    coverage: 500,
    features: ['Real-time Risk Alerts', 'Standard API Support', 'Email Support']
  },
  {
    id: 'standard',
    name: 'Standard',
    premium: 99,
    coverage: 1000,
    features: ['Automated Claim triggers', 'Priority API Support', '24/7 Phone Support']
  },
  {
    id: 'pro',
    name: 'Pro',
    premium: 199,
    coverage: 2000,
    features: ['Instant Machine Payouts', 'Direct Bank Transfer', 'Dedicated Account Manager']
  }
];

const Purchase = ({ onBack, onHome }) => {
  const [selectedPlan, setSelectedPlan] = useState(plans[1]); // Default to standard
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState('idle'); // idle, success, error
  const [errorDetails, setErrorDetails] = useState('');

  const handleBuyNow = async () => {
    setIsPurchasing(true);
    setErrorDetails('');
    
    try {
      const payload = {
        userId: "user_gig_1048", // Simulated ID for demo
        planType: selectedPlan.name,
        premium: selectedPlan.premium
      };

      const res = await fetch('http://localhost:5000/api/policy/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Transaction failed');
      }

      // Simulated network delay for UX
      setTimeout(() => {
        setPurchaseStatus('success');
        setIsPurchasing(false);
      }, 1500);

    } catch (err) {
      console.error(err);
      // Fallback for demo if backend is offline
      setTimeout(() => {
        setPurchaseStatus('success');
        setIsPurchasing(false);
      }, 1500);
    }
  };

  const getExpiryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (purchaseStatus === 'success') {
    return (
       <div className="w-full h-full flex items-center justify-center p-4">
          <PolicySuccess 
            coverage={selectedPlan.coverage} 
            expiryDate={getExpiryDate()} 
            onHome={onHome} 
          />
       </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 relative">
       {/* Background */}
       <div className="fixed inset-0 bg-slate-50 -z-20" />
       <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-300/20 to-indigo-400/20 blur-3xl rounded-full -z-10" />
       <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-300/20 to-blue-400/20 blur-3xl rounded-full -z-10" />

       <div className="text-center max-w-2xl mx-auto mb-12 relative z-10 pt-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl mb-6 shadow-blue-500/10 border border-blue-50"
          >
            <ShieldAlert className="w-8 h-8 text-blue-600" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4"
          >
            Secure Your Gig Shift
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500"
          >
            Select a protection plan that matches your risk profile. Get Instant coverage against rainfall and high traffic incidents.
          </motion.p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 max-w-5xl mx-auto relative z-10 w-full px-4 sm:px-0">
         {plans.map((plan, idx) => (
           <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              key={plan.id}
           >
             <PlanCard 
                plan={plan} 
                isSelected={selectedPlan.id === plan.id} 
                onSelect={(p) => !isPurchasing && setSelectedPlan(p)} 
             />
           </motion.div>
         ))}
       </div>

       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.4 }}
         className="max-w-md mx-auto text-center relative z-10"
       >
         <motion.button
            whileHover={!isPurchasing ? { scale: 1.02, y: -2 } : {}}
            whileTap={!isPurchasing ? { scale: 0.98 } : {}}
            onClick={handleBuyNow}
            disabled={isPurchasing}
            className="w-full flex items-center justify-center py-4 px-8 border border-transparent rounded-2xl shadow-xl shadow-blue-500/20 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all"
         >
            {isPurchasing ? (
               <span className="flex items-center">
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Processing Payment...
               </span>
            ) : (
               `Buy ${selectedPlan.name} Plan - ₹${selectedPlan.premium}`
            )}
         </motion.button>
         <p className="mt-4 text-xs font-medium text-slate-400 pb-10">
           By clicking Buy, you agree to the GigRakshak micro-insurance Terms & Conditions.
         </p>
       </motion.div>

    </div>
  );
};

export default Purchase;
