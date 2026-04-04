import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, IndianRupee, Zap, CheckCircle, Clock, Bike, User, Shield, Briefcase, Mail, Phone, Lock, Eye, EyeOff, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService, handleApiError } from '../services/api';

const RegistrationPage = ({ onRegistrationSuccess, onSwitchToLogin }) => {
  const [step, setStep] = useState(1); // 1 = Account, 2 = Location, 3 = Work
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    pincode: '',
    city: '',
    state: '',
    income: '',
    workType: 'Zomato',
    vehicleType: 'Bike',
    experience: '0'
  });

  const [loading, setLoading] = useState(false);
  const [fetchingPincode, setFetchingPincode] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  
  const platforms = ['Zomato', 'Swiggy', 'Zepto', 'Blinkit', 'Amazon', 'Flipkart', 'Dunzo', 'Uber Eats', 'Other'];
  const vehicles = ['Bicycle', 'Bike', 'Scooter', 'Auto', 'Car', 'On Foot', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [manualEntry, setManualEntry] = useState(false);

  const handlePincodeChange = async (e) => {
    const pin = e.target.value.replace(/\D/g, ''); // digits only
    setFormData(prev => ({ ...prev, pincode: pin, city: '', state: '' }));
    setManualEntry(false);

    if (pin.length !== 6) return;

    setFetchingPincode(true);

    try {
      // Call our own backend proxy — avoids CORS, browser blocks, & API reliability issues
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE}/pincode/${pin}`);
      const data = await res.json();

      if (data.success && data.district && data.state) {
        setFormData(prev => ({
          ...prev,
          city: data.district,
          state: data.state,
        }));
        toast.success(`📍 ${data.district}, ${data.state}`);
      } else {
        // Backend returned failure — let user type manually
        toast('✏️ Please enter your city & state manually', { duration: 3500 });
        setManualEntry(true);
      }
    } catch (err) {
      console.warn('Pincode proxy failed:', err.message);
      toast('✏️ Please enter your city & state manually', { duration: 3500 });
      setManualEntry(true);
    } finally {
      setFetchingPincode(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      // Validate Step 1: Account Details
      if (!formData.name.trim()) {
        toast.error('❌ Please enter your name');
        return;
      }
      if (!formData.email.trim()) {
        toast.error('❌ Please enter your email');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error('❌ Invalid email format');
        return;
      }
      if (!formData.password) {
        toast.error('❌ Please enter a password');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('❌ Password must be at least 6 characters');
        return;
      }
    }
    if (step === 2) {
      // Validate Step 2: Location
      if (!formData.pincode || formData.pincode.length !== 6) {
        toast.error('❌ Please enter a valid 6-digit Pincode');
        return;
      }
      if (fetchingPincode) {
        toast('⏳ Still looking up pincode, please wait...', { icon: '🔍' });
        return;
      }
      if (!formData.city.trim()) {
        toast.error('❌ Please enter your District/City');
        return;
      }
      if (!formData.state.trim()) {
        toast.error('❌ Please enter your State');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    if (!formData.workType || !formData.income || parseFloat(formData.income) <= 0) {
      toast.error('❌ Please enter a valid daily income');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        ...formData,
        income: parseFloat(formData.income),
        experience: parseFloat(formData.experience)
      });
      
      if (response.success && response.data?.user) {
        toast.success(response.message || '✅ Registration successful');
        onRegistrationSuccess(response.data.user);
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      const errorMsg = handleApiError(error);
      toast.error(errorMsg);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";
  const selectClass = "w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm appearance-none";

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
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative"
      >
        <div className="bg-white/[0.05] backdrop-blur-3xl border border-white/[0.1] rounded-3xl p-8 shadow-2xl shadow-black/50 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-0" />

          {/* Header */}
          <div className="relative z-10 text-center mb-8">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center mb-4 shadow-xl shadow-blue-900/40"
            >
              <Shield className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Create Account</h1>
            <p className="text-slate-400 text-sm">Step {step} of 3</p>
          </div>

          {/* Progress Bar */}
          <div className="relative z-10 w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* ────────────────────────────────────
                STEP 1: Account Details
            ──────────────────────────────────── */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <User size={16} /> Name
                    </label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" className={inputClass}  disabled={loading} />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <Mail size={16} /> Email
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} disabled={loading} />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <Lock size={16} /> Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPwd ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="At least 6 characters"
                        className={inputClass + " pr-12"}
                        disabled={loading}
                      />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-3 text-slate-400">
                        {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <Phone size={16} /> Phone (Optional)
                    </label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit mobile number" className={inputClass} disabled={loading} />
                  </div>
                </motion.div>
              )}

              {/* ────────────────────────────────────
                  STEP 2: Location
              ──────────────────────────────────── */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <MapPin size={16} /> Pincode
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handlePincodeChange}
                        placeholder="Enter 6-digit pincode"
                        className={inputClass}
                        maxLength="6"
                        inputMode="numeric"
                        disabled={loading || fetchingPincode}
                      />
                      {fetchingPincode && (
                        <div className="absolute right-3 top-3 flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                      )}
                      {!fetchingPincode && formData.city && (
                        <div className="absolute right-3 top-3 text-green-400 text-xs font-semibold">✓ Detected</div>
                      )}
                      {!fetchingPincode && manualEntry && (
                        <div className="absolute right-3 top-3 text-amber-400 text-xs font-semibold">✏️ Manual</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1">
                        District / City
                        {manualEntry && <span className="text-amber-400 text-[10px]">(required)</span>}
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={manualEntry ? handleChange : undefined}
                        placeholder={manualEntry ? "Enter your district" : "Auto-filled from pincode"}
                        className={inputClass}
                        disabled={!manualEntry || loading}
                        style={manualEntry ? {} : { opacity: 0.7 }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1">
                        State
                        {manualEntry && <span className="text-amber-400 text-[10px]">(required)</span>}
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={manualEntry ? handleChange : undefined}
                        placeholder={manualEntry ? "Enter your state" : "Auto-filled from pincode"}
                        className={inputClass}
                        disabled={!manualEntry || loading}
                        style={manualEntry ? {} : { opacity: 0.7 }}
                      />
                    </div>
                  </div>

                  {manualEntry && (
                    <p className="text-xs text-amber-400/80 flex items-start gap-1.5">
                      <span>⚠️</span>
                      <span>Pincode lookup is currently unavailable. Please type your District and State manually above to continue.</span>
                    </p>
                  )}
                </motion.div>
              )}


              {/* ────────────────────────────────────
                  STEP 3: Work Details
              ──────────────────────────────────── */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <Briefcase size={16} /> Platform
                    </label>
                    <select name="workType" value={formData.workType} onChange={handleChange} className={selectClass} disabled={loading}>
                      {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <Bike size={16} /> Vehicle Type
                    </label>
                    <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className={selectClass} disabled={loading}>
                      {vehicles.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <Clock size={16} /> Experience (Years)
                    </label>
                    <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="0" min="0" className={inputClass} disabled={loading} />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <IndianRupee size={16} /> Daily Income (₹)
                    </label>
                    <input type="number" name="income" value={formData.income} onChange={handleChange} placeholder="Average daily earnings" min="0" step="100" className={inputClass} disabled={loading} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="relative z-10 flex gap-4 mt-8 pt-4 border-t border-white/10">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(prev => prev - 1)}
                  disabled={loading}
                  className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all"
                >
                  ← Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="relative z-10 text-center mt-6 text-slate-400 text-sm">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              disabled={loading}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign in
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationPage;
