import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Import all pages
import Landing from './pages/Landing';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import RiskCalculator from './components/RiskCalculator';
import RiskResultPage from './pages/RiskResultPage';
import PlanSelectionPage from './pages/PlanSelectionPage';
import Dashboard from './pages/Dashboard';

/**
 * 🚀 COMPLETE APP FLOW
 * Landing → Login → Registration → Risk Calculator → Risk Result → Plan Selection → Dashboard
 */
function App() {
  const [currentView, setCurrentView] = useState(() => {
    const saved = localStorage.getItem('appView');
    return saved || 'landing';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [riskData, setRiskData] = useState(() => {
    const saved = localStorage.getItem('riskData');
    return saved ? JSON.parse(saved) : null;
  });

  const [location, setLocation] = useState(() => {
    return localStorage.getItem('userLocation') || '';
  });

  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem('userIncome');
    return saved ? parseFloat(saved) : 0;
  });

  const [selectedPlan, setSelectedPlan] = useState(() => {
    const saved = localStorage.getItem('selectedPlan');
    return saved ? JSON.parse(saved) : null;
  });

  const [policyData, setPolicyData] = useState(() => {
    const saved = localStorage.getItem('policyData');
    return saved ? JSON.parse(saved) : null;
  });

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('appView', currentView);
  }, [currentView]);

  useEffect(() => {
    if (riskData) localStorage.setItem('riskData', JSON.stringify(riskData));
  }, [riskData]);

  useEffect(() => {
    if (location) localStorage.setItem('userLocation', location);
  }, [location]);

  useEffect(() => {
    if (income) localStorage.setItem('userIncome', income.toString());
  }, [income]);

  useEffect(() => {
    if (selectedPlan) localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
  }, [selectedPlan]);

  useEffect(() => {
    if (policyData) localStorage.setItem('policyData', JSON.stringify(policyData));
  }, [policyData]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentView('registration');
  };

  const handleRegistrationSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentView('onboarding');
  };

  const handleRiskCalculated = (riskResult, loc, inc) => {
    setRiskData(riskResult);
    setLocation(loc);
    setIncome(inc);
    setCurrentView('riskResult');
  };

  const handlePlanSelected = (plan, policy) => {
    setSelectedPlan(plan);
    setPolicyData(policy);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setRiskData(null);
    setSelectedPlan(null);
    setPolicyData(null);
    setCurrentView('landing');
  };

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.35 }
  };

  return (
    <div className="w-full h-full font-sans text-slate-900 min-h-screen">
      <AnimatePresence mode="wait">
        {/* 🏠 Landing */}
        {currentView === 'landing' && (
          <motion.div key="landing" {...pageTransition}>
            <Landing onGetStarted={() => setCurrentView('login')} />
          </motion.div>
        )}

        {/* 🔐 Login */}
        {currentView === 'login' && (
          <motion.div key="login" {...pageTransition}>
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          </motion.div>
        )}

        {/* 📝 Registration */}
        {currentView === 'registration' && (
          <motion.div key="registration" {...pageTransition}>
            <RegistrationPage onRegistrationSuccess={handleRegistrationSuccess} />
          </motion.div>
        )}

        {/* 🎯 Risk Calculator */}
        {currentView === 'onboarding' && user && (
          <motion.div key="onboarding" {...pageTransition}>
            <div className="absolute top-4 left-4 z-50">
              <button
                onClick={() => setCurrentView('landing')}
                className="bg-white/70 backdrop-blur-md border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-medium text-sm hover:bg-white transition-all"
              >
                ← Home
              </button>
            </div>
            <RiskCalculator onRiskCalculated={handleRiskCalculated} />
          </motion.div>
        )}

        {/* 📊 Risk Result */}
        {currentView === 'riskResult' && riskData && (
          <motion.div key="riskResult" {...pageTransition}>
            <div className="absolute top-4 left-4 z-50">
              <button
                onClick={() => setCurrentView('onboarding')}
                className="bg-white/70 backdrop-blur-md border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-medium text-sm hover:bg-white transition-all"
              >
                ← Back
              </button>
            </div>
            <RiskResultPage
              riskData={riskData}
              onContinue={() => setCurrentView('planSelection')}
            />
          </motion.div>
        )}

        {/* 💼 Plan Selection */}
        {currentView === 'planSelection' && riskData && user && (
          <motion.div key="planSelection" {...pageTransition}>
            <div className="absolute top-4 left-4 z-50">
              <button
                onClick={() => setCurrentView('riskResult')}
                className="bg-white/70 backdrop-blur-md border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-medium text-sm hover:bg-white transition-all"
              >
                ← Back
              </button>
            </div>
            <PlanSelectionPage
              riskLevel={riskData.riskLevel}
              riskScore={riskData.riskScore}
              recommendedPlan={riskData.planRecommendation}
              onSelectPlan={handlePlanSelected}
              dailyIncome={income}
              userId={user.id}
            />
          </motion.div>
        )}

        {/* 🎯 Dashboard */}
        {currentView === 'dashboard' && user && (
          <motion.div key="dashboard" {...pageTransition}>
            <Dashboard
              user={user}
              riskData={riskData}
              currentLocation={location}
              dailyIncome={income}
              selectedPlan={selectedPlan}
              policyData={policyData}
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;