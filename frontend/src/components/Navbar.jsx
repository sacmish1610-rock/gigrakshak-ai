import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Menu, X } from 'lucide-react';

const Navbar = ({ onGetStarted }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2 cursor-pointer">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30"
            >
              <Shield className="w-6 h-6" />
            </motion.div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              GigRakshak AI
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#api" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">API Core</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2">
              Sign In
            </button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-slate-900/20"
            >
              Get Started
            </motion.button>
          </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-100"
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            <a href="#features" className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg">Features</a>
            <a href="#how-it-works" className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg">How it Works</a>
            <a href="#api" className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg">API Core</a>
            <div className="pt-4 flex flex-col gap-3">
              <button className="w-full text-center px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700">Sign In</button>
              <button onClick={onGetStarted} className="w-full text-center px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20">Get Started</button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;