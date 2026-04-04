import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService, handleApiError } from '../services/api';

const LoginPage = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email.trim() || !password) {
      toast.error('❌ Please enter email and password');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('❌ Invalid email format');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(email.trim(), password);
      
      if (response.success && response.data?.user) {
        toast.success(response.message || '✅ Login successful');
        onLoginSuccess(response.data.user);
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      toast.error(errorMsg);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/20 rounded-xl px-4 pt-6 pb-2 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all transition-colors peer";
  const labelClass = "absolute text-sm text-slate-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-400";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{
      background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.3) 0%, transparent 70%), #050814'
    }}>
      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md relative"
      >
        {/* Card */}
        <div className="bg-white/[0.05] backdrop-blur-3xl border border-white/[0.1] rounded-3xl p-8 shadow-2xl shadow-black/50 overflow-hidden relative">
          
          {/* subtle inner shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-0" />

          {/* Logo + heading */}
          <div className="relative z-10 text-center mb-8">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center mb-4 shadow-xl shadow-blue-900/40"
            >
              <Shield className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 text-sm">Sign in to GigRakshak AI Dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10 w-full">
            <div className="relative w-full">
               <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder=" "
                className={inputClass}
                autoComplete="email"
                disabled={loading}
              />
              <label htmlFor="email" className={labelClass}>Email Address</label>
            </div>

            <div className="relative w-full group">
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder=" "
                className={inputClass + " pr-12"}
                disabled={loading}
              />
              <label htmlFor="password" className={labelClass}>Password</label>
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-6 text-slate-400 hover:text-white transition-colors"
                disabled={loading}
              >
                {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ boxShadow: "0 0 30px rgba(59,130,246,0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all mt-8 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="relative z-10 text-center mt-6 text-slate-400 text-sm">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              disabled={loading}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign up
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
