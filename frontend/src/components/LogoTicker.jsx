import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  {
    name: 'zepto',
    color: 'text-purple-700',
    font: 'font-bold tracking-tighter text-3xl',
    render: () => <span className="text-purple-700 font-bold tracking-tighter text-3xl lowercase">zepto</span>
  },
  {
    name: "Domino's",
    render: () => (
      <div className="flex items-center gap-1">
        {/* Simple Domino icon representation */}
        <div className="flex gap-[2px]">
           <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
           <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
        </div>
        <span className="text-[#006491] font-black tracking-tight text-2xl">Domino's</span>
      </div>
    )
  },
  {
    name: 'rapido',
    render: () => (
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
           <div className="w-2 h-2 bg-black rounded-full" />
        </div>
        <span className="text-black font-extrabold tracking-tight text-2xl">rapido</span>
      </div>
    )
  },
  {
    name: 'blinkit',
    render: () => (
      <div className="bg-[#f8cb46] px-3 py-1 rounded-md">
        <span className="text-green-800 font-black tracking-tight text-2xl lowercase">blinkit</span>
      </div>
    )
  },
  {
    name: 'zomato',
    render: () => <span className="text-[#cb202d] font-black tracking-tighter text-4xl italic lowercase">zomato</span>
  },
  {
    name: 'Swiggy',
    render: () => <span className="text-[#fc8019] font-black tracking-tighter text-3xl lowercase">swiggy</span>
  }
];

const LogoTicker = () => {
  return (
    <div className="py-10 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
          Protecting Delivery Partners Across Top Platforms
        </p>
        
        {/* Simple flex container for logos instead of infinite marquee to keep it clean */}
        <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-16 lg:gap-24 opacity-80 grayscale-[20%] hover:grayscale-0 transition-all duration-500">
           {logos.map((logo, index) => (
             <motion.div 
               key={index}
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1, duration: 0.5 }}
               className="flex items-center justify-center hover:scale-105 transition-transform"
             >
               {logo.render()}
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default LogoTicker;
