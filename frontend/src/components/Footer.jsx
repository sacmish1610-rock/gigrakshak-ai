import React from 'react';
import { Shield } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-white/[0.06] py-10 bg-[#050814]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white text-sm">GigRakshak <span className="text-blue-400">AI</span></span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6">
          {['Privacy Policy', 'Terms of Service', 'API Docs', 'Contact'].map(l => (
            <a key={l} href="#" className="text-slate-600 hover:text-slate-300 text-sm transition-colors">{l}</a>
          ))}
        </div>

        {/* Right */}
        <p className="text-slate-700 text-xs">
          © {new Date().getFullYear()} GigRakshak AI · Guidewire DEVTrails 2026
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
