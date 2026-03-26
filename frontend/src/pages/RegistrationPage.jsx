import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, IndianRupee, Zap, AlertCircle, CheckCircle, Clock, Bike, User } from 'lucide-react';

const RegistrationPage = ({ onRegistrationSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    zone: '',
    dailyIncome: '',
    platform: 'Zomato',
    vehicleType: 'Bike',
    workingHours: '8',
    experienceMonths: '6'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const platforms = ['Zomato', 'Swiggy', 'Zepto', 'Blinkit', 'Amazon', 'Flipkart', 'Dunzo', 'Uber Eats', 'Other'];
  const vehicles = ['Bicycle', 'Bike', 'Scooter', 'Auto', 'Car', 'On Foot', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.location.trim()) return 'Location is required';
    if (!formData.dailyIncome || isNaN(formData.dailyIncome) || parseFloat(formData.dailyIncome) <= 0) {
      return 'Valid daily income is required';
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          location: formData.location.trim(),
          zone: formData.zone.trim() || formData.location.trim(),
          dailyIncome: parseFloat(formData.dailyIncome),
          platform: formData.platform,
          vehicleType: formData.vehicleType,
          workingHours: parseInt(formData.workingHours) || 8,
          experienceMonths: parseInt(formData.experienceMonths) || 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      setSuccess(true);

      setTimeout(() => {
        if (onRegistrationSuccess) {
          onRegistrationSuccess({
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            location: data.user.location,
            zone: data.user.zone,
            dailyIncome: data.user.dailyIncome,
            platform: data.user.platform,
            vehicleType: data.user.vehicleType,
            workingHours: data.user.workingHours,
            experienceMonths: data.user.experienceMonths
          });
        }
      }, 1200);

    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all disabled:opacity-50";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-3 rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-white text-3xl font-bold mb-2">Join GigRakshak</h1>
            <p className="text-slate-300 text-sm">Step {step} of 2 — {step === 1 ? 'Basic Details' : 'Work Profile'}</p>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-cyan-400' : 'bg-white/20'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-cyan-400' : 'bg-white/20'}`} />
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Success */}
          {success && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-green-300 text-sm font-medium">Registration successful! ✅</p>
                <p className="text-green-300/70 text-xs">Proceeding to risk assessment...</p>
              </div>
            </motion.div>
          )}

          {/* Step 1: Basic Details */}
          {!success && step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-cyan-400" /> Full Name *
                </label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Rahul Sharma" className={inputClass} />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-400" /> Work Location *
                </label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Mumbai, Delhi, Bangalore..." className={inputClass} />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-cyan-400" /> Daily Income (₹) *
                </label>
                <input type="number" name="dailyIncome" value={formData.dailyIncome} onChange={handleChange} placeholder="800" min="1" className={inputClass} />
                {formData.dailyIncome > 0 && (
                  <p className="text-cyan-300/60 text-xs mt-1">Weekly income: ₹{(parseFloat(formData.dailyIncome) * 7).toLocaleString()}</p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Email (optional)</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="rahul@example.com" className={inputClass} />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Phone (optional)</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 9876543210" className={inputClass} />
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleNext}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                Next → Work Profile
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Work Profile */}
          {!success && step === 2 && (
            <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Delivery Platform *</label>
                <select name="platform" value={formData.platform} onChange={handleChange} className={inputClass + " bg-slate-800"}>
                  {platforms.map(p => <option key={p} value={p} className="bg-slate-800">{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                  <Bike className="h-4 w-4 text-cyan-400" /> Vehicle Type
                </label>
                <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className={inputClass + " bg-slate-800"}>
                  {vehicles.map(v => <option key={v} value={v} className="bg-slate-800">{v}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-400" /> Working Hours/Day
                </label>
                <input type="number" name="workingHours" value={formData.workingHours} onChange={handleChange} min="1" max="18" className={inputClass} />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Experience (months)</label>
                <input type="number" name="experienceMonths" value={formData.experienceMonths} onChange={handleChange} min="0" className={inputClass} />
                {parseInt(formData.experienceMonths) > 12 && (
                  <p className="text-green-300/60 text-xs mt-1">✨ Experienced worker — eligible for premium discount!</p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Work Zone (area/neighborhood)</label>
                <input type="text" name="zone" value={formData.zone} onChange={handleChange} placeholder="Koramangala, Andheri West..." className={inputClass} />
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setStep(1)}
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all">
                  ← Back
                </button>
                <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Registering...</>
                  ) : (
                    <><CheckCircle className="h-5 w-5" /> Register & Continue</>
                  )}
                </motion.button>
              </div>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationPage;
