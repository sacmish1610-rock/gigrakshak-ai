import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Brain, Lock, CloudRain, Clock } from 'lucide-react';

const featureData = [
  {
    icon: Brain,
    gradient: 'from-blue-100 to-indigo-50 text-blue-600',
    border: 'border-blue-200',
    title: 'AI-Powered Risk Engine',
    description: 'Dynamic premium calculation using hyper-local weather, AQI, heat index, and zone-based historical risk.',
    badge: 'Machine Learning'
  },
  {
    icon: Zap,
    gradient: 'from-cyan-100 to-blue-50 text-cyan-600',
    border: 'border-cyan-200',
    title: 'Parametric Auto-Claim',
    description: '5 distinct trigger conditions fire automatically. Receive a UPI payout in under 3 seconds — zero forms.',
    badge: 'Zero-touch'
  },
  {
    icon: ShieldCheck,
    gradient: 'from-violet-100 to-purple-50 text-violet-600',
    border: 'border-violet-200',
    title: 'Weekly Pricing Model',
    description: 'Premiums structured on a weekly cycle to match how you earn. Cancel, renew, or upgrade every Sunday.',
    badge: '₹49 – ₹199/week'
  },
  {
    icon: Lock,
    gradient: 'from-rose-100 to-pink-50 text-rose-600',
    border: 'border-rose-200',
    title: 'Intelligent Fraud Guard',
    description: 'Multi-layer fraud detection: GPS pattern analysis, duplicate claim prevention protect every rupee.',
    badge: 'Real-time'
  },
  {
    icon: CloudRain,
    gradient: 'from-amber-100 to-orange-50 text-amber-600',
    border: 'border-amber-200',
    title: 'Live Weather Monitoring',
    description: 'Real-time integration across 10 major cities. Rain, AQI, and temperature thresholds monitored 24/7.',
    badge: 'Live API'
  },
  {
    icon: Clock,
    gradient: 'from-emerald-100 to-green-50 text-emerald-600',
    border: 'border-emerald-200',
    title: 'Instant UPI Payouts',
    description: 'When a trigger fires, the claim is processed and payment sent directly to your UPI ID within milliseconds.',
    badge: 'Sub-second'
  },
];

const FeatureCard = ({ feature, index }) => {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative p-8 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 overflow-hidden"
    >
      {/* Icon */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} ${feature.border} border flex items-center justify-center mb-6 shadow-sm`}
      >
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">{feature.title}</h3>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed relative z-10">{feature.description}</p>
      
      {/* Badge */}
      <span className="inline-block relative z-10 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
        {feature.badge}
      </span>
      
      {/* Hover background effect */}
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
         <Icon className="w-32 h-32 transform translate-x-8 -translate-y-8" />
      </div>
    </motion.div>
  );
};

const Features = () => (
  <section id="features" className="relative py-24 bg-slate-50 border-t border-slate-100 overflow-hidden">
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-20">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4"
        >
          Platform Capabilities
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight"
        >
          Built for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Modern Gig Worker</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-slate-600 mt-6 max-w-2xl text-lg mx-auto"
        >
          Every feature is designed around the reality of platform-based delivery work in India. Making insurance frictionless and lightning fast.
        </motion.p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureData.map((f, i) => <FeatureCard key={i} feature={f} index={i} />)}
      </div>

      {/* Bottom CTA strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 p-8 sm:p-10 rounded-[2rem] bg-white border border-blue-100 shadow-2xl shadow-blue-900/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-70 -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="text-center md:text-left z-10">
          <h3 className="text-slate-900 font-extrabold text-2xl sm:text-3xl mb-2">Ready to protect your income?</h3>
          <p className="text-slate-600 md:text-lg">Get covered in under 2 minutes. Transparent weekly plans starting at ₹49.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 z-10">
          <div className="text-center md:text-right hidden sm:block">
            <p className="text-slate-900 text-sm font-bold">Weekly plans</p>
            <p className="text-blue-600 font-medium">from ₹49 / week</p>
          </div>
          <div className="w-px h-12 bg-slate-200 hidden sm:block" />
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-600/20 whitespace-nowrap">
             Get Covered Now
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Features;