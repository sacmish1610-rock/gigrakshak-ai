import React from 'react';
import { Database, Code2, Cpu, ShieldAlert, Zap, Banknote } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, api }) => (
  <div className="bg-white/60 backdrop-blur-lg border border-slate-200 hover:border-blue-300 transition-all duration-300 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 group">
    <div className="w-14 h-14 bg-slate-50 group-hover:bg-blue-50 rounded-2xl flex items-center justify-center mb-6 transition-colors">
      <Icon className="w-7 h-7 text-slate-600 group-hover:text-blue-600 transition-colors" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed mb-4">{desc}</p>
    <div className="inline-flex items-center px-3 py-1 rounded-md bg-slate-100 text-xs font-mono text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
      <Code2 className="w-3 h-3 mr-1.5" />
      {api}
    </div>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: Cpu,
      title: "AI Risk Assessment",
      desc: "Dynamically calculates risk level utilizing realistic parameters such as weather, traffic density, and Air Quality Index.",
      api: "POST /api/risk"
    },
    {
      icon: Database,
      title: "Dynamic Pricing Engine",
      desc: "Calculates precise micro-premiums based on a rider's exact gig characteristics and real-time risk scores.",
      api: "POST /api/pricing"
    },
    {
      icon: ShieldAlert,
      title: "Seamless Policy Creation",
      desc: "Issues secure, instantaneous micro-policies backed by secure Node.js & MongoDB architecture.",
      api: "POST /api/policy/buy"
    },
    {
      icon: Zap,
      title: "Parametric Triggers",
      desc: "Monitors local data hooks to automatically execute coverage activation when strict parameters are breached.",
      api: "POST /api/trigger"
    },
    {
      icon: Banknote,
      title: "Automated Claims",
      desc: "Fast-tracks validation and automates direct payout settlements without manual underwriting or delays.",
      api: "POST /api/claim"
    }
  ];

  return (
    <div id="api" className="py-24 bg-white relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-black tracking-widest text-indigo-500 uppercase mb-3">Backend Core</h2>
          <p className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Developer-first infrastructure.
          </p>
          <p className="text-lg text-slate-600 font-medium">
            A comprehensive suite of API endpoints powering the world's first AI gig-insurance platform. Plug directly into our smart engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <FeatureCard key={idx} {...feat} />
          ))}
          
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <h3 className="text-2xl font-bold text-white mb-4 z-10">Ready to integrate?</h3>
            <p className="text-indigo-200 mb-6 z-10">Extensive documentation and enterprise-grade SDKs available for partners.</p>
            <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm w-full transition-all hover:scale-105 shadow-xl shadow-white/10 z-10">
              Read Developer Docs
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Features;