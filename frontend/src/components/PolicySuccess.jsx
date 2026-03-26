import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

const PolicySuccess = ({ coverage, expiryDate, onHome }) => {
  useEffect(() => {
    const end = Date.now() + 1.5 * 1000;
    const colors = ['#3b82f6', '#10b981', '#6366f1'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  return (
    <motion.div
       initial={{ opacity: 0, scale: 0.9 }}
       animate={{ opacity: 1, scale: 1 }}
       className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 text-center"
    >
       <motion.div 
         initial={{ scale: 0 }}
         animate={{ scale: 1 }}
         transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
         className="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
       >
         <Check className="w-12 h-12 text-white" strokeWidth={3} />
       </motion.div>

       <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Protected!</h2>
       <p className="text-lg text-slate-600 font-medium mb-8">
         Your earnings are protected for the next 7 days.
       </p>

       <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-left mb-8">
         <div className="flex items-center justify-between mb-4">
           <div className="flex items-center text-slate-600 font-medium">
             <ShieldCheck className="w-5 h-5 mr-2 text-indigo-500" />
             Total Coverage
           </div>
           <span className="text-xl font-bold text-slate-900">₹{coverage}</span>
         </div>
         <div className="flex items-center justify-between">
           <div className="flex items-center text-slate-600 font-medium">
             <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
             Expiry Date
           </div>
           <span className="text-sm font-bold text-slate-900">{expiryDate}</span>
         </div>
       </div>

       <motion.button
         whileHover={{ scale: 1.02 }}
         whileTap={{ scale: 0.98 }}
         onClick={onHome}
         className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-xl shadow-slate-900/20 transition-all"
       >
         Back to Dashboard
       </motion.button>
    </motion.div>
  );
};

export default PolicySuccess;
