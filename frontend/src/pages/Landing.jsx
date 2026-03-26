import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

const Landing = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-500/30">
      <Navbar onGetStarted={onGetStarted} />
      <Hero onGetStarted={onGetStarted} />
      <Features />
      <Footer />
    </div>
  );
};

export default Landing;
