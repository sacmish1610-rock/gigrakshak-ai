import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, LogIn, AlertCircle } from 'lucide-react';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter an email or name');
      return;
    }

    // For demo: directly proceed
    onLoginSuccess({
      email: email.trim(),
      name: email.split('@')[0] || email.trim()
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md">

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-3 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-white text-3xl font-bold mb-2">GigRakshak AI</h1>
            <p className="text-slate-300 text-sm">AI-Powered Weekly Insurance for Gig Workers</p>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-3 mb-6">
            <p className="text-cyan-200 text-xs text-center flex items-center justify-center gap-2">
              🧪 Demo mode — Enter any email to continue
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Email / Name</label>
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="worker@example.com"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all" />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Any password (demo)"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all" />
            </div>

            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5" /> Continue to Registration
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
