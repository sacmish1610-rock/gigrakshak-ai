import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

// API service
import { authService, isAuthenticated, handleApiError } from './services/api';

// Pages & Components
import Landing from './pages/Landing';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import RiskCalculator from './components/RiskCalculator';
import RiskResultPage from './pages/RiskResultPage';
import PlanSelectionPage from './pages/PlanSelectionPage';
import Dashboard from './pages/Dashboard';

// ============================================================
// 🔐 AUTH CONTEXT — Share auth state across entire app
// ============================================================
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// ============================================================
// 🛡️ PROTECTED ROUTE — Redirect to /login if not logged in
// ============================================================
const ProtectedRoute = ({ children }) => {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#050814] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ============================================================
// 🔒 PUBLIC ROUTE — Redirect to /dashboard if already logged in
// ============================================================
const PublicRoute = ({ children }) => {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#050814] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// ============================================================
// 🎨 PAGE WRAPPER — Smooth transition animation
// ============================================================
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    {children}
  </motion.div>
);

// ============================================================
// 🏗️ MAIN APP — Provides auth context + defines all routes
// ============================================================
function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Shared flow state (persisted to localStorage)
  const [riskData, setRiskData] = useState(() => {
    const s = localStorage.getItem('riskData');
    return s ? JSON.parse(s) : null;
  });
  const [location, setLocation] = useState(() => localStorage.getItem('userLocation') || '');
  const [income, setIncome] = useState(() => {
    const s = localStorage.getItem('userIncome');
    return s ? parseFloat(s) : 0;
  });
  const [selectedPlan, setSelectedPlan] = useState(() => {
    const s = localStorage.getItem('selectedPlan');
    return s ? JSON.parse(s) : null;
  });
  const [policyData, setPolicyData] = useState(() => {
    const s = localStorage.getItem('policyData');
    return s ? JSON.parse(s) : null;
  });

  // ── Sync state to localStorage ──
  useEffect(() => { if (riskData) localStorage.setItem('riskData', JSON.stringify(riskData)); }, [riskData]);
  useEffect(() => { if (location) localStorage.setItem('userLocation', location); }, [location]);
  useEffect(() => { if (income) localStorage.setItem('userIncome', income.toString()); }, [income]);
  useEffect(() => { if (selectedPlan) localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan)); }, [selectedPlan]);
  useEffect(() => { if (policyData) localStorage.setItem('policyData', JSON.stringify(policyData)); }, [policyData]);

  // ── Verify token on app load ──
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          const response = await authService.getProfile();
          if (response.success && response.data?.user) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('❌ Auth check failed:', handleApiError(error));
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoadingAuth(false);
      }
    };
    checkAuth();
  }, []);

  // ── Logout ──
  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore
    }
    setUser(null);
    setRiskData(null);
    setSelectedPlan(null);
    setPolicyData(null);
    localStorage.clear();
    toast.success('✅ Logged out successfully');
    // Navigate happens in the component via useNavigate
  };

  const contextValue = {
    user, setUser,
    loadingAuth,
    riskData, setRiskData,
    location, setLocation,
    income, setIncome,
    selectedPlan, setSelectedPlan,
    policyData, setPolicyData,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <div className="w-full h-full font-sans text-slate-900 min-h-screen">
        <Toaster
          position="top-center"
          toastOptions={{ style: { background: '#1e293b', color: '#fff', borderRadius: '12px' } }}
        />
        <AppRoutes />
      </div>
    </AuthContext.Provider>
  );
}

// ============================================================
// 🗺️ ROUTES — Defined in a separate component so useLocation works
// ============================================================
function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Public landing */}
        <Route
          path="/"
          element={
            <PageWrapper>
              <LandingWrapper />
            </PageWrapper>
          }
        />

        {/* Login — redirects to /dashboard if already logged in */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <PageWrapper>
                <LoginWrapper />
              </PageWrapper>
            </PublicRoute>
          }
        />

        {/* Registration */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <PageWrapper>
                <RegistrationWrapper />
              </PageWrapper>
            </PublicRoute>
          }
        />

        {/* Protected: Risk onboarding */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <OnboardingWrapper />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* Protected: Risk result */}
        <Route
          path="/risk-result"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <RiskResultWrapper />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* Protected: Plan selection */}
        <Route
          path="/plan-selection"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <PlanSelectionWrapper />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* Protected: Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <DashboardWrapper />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* Catch-all → home */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AnimatePresence>
  );
}

// ============================================================
// 🧩 ROUTE WRAPPERS — Connect router navigation to components
// ============================================================

function LandingWrapper() {
  const navigate = useNavigate();
  return <Landing onGetStarted={() => navigate('/login')} />;
}

function LoginWrapper() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    toast.success('✅ Welcome back!');
    if (!userData.recommendedPlan) {
      navigate('/onboarding');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <LoginPage
      onLoginSuccess={handleLoginSuccess}
      onSwitchToSignup={() => navigate('/register')}
    />
  );
}

function RegistrationWrapper() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleRegistrationSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    toast.success('✅ Account created!');
    navigate('/onboarding');
  };

  return (
    <RegistrationPage
      onRegistrationSuccess={handleRegistrationSuccess}
      onSwitchToLogin={() => navigate('/login')}
    />
  );
}

function OnboardingWrapper() {
  const navigate = useNavigate();
  const { setRiskData, setLocation, setIncome } = useAuth();

  const handleRiskCalculated = (riskResult, loc, inc) => {
    setRiskData(riskResult);
    setLocation(loc);
    setIncome(inc);
    navigate('/risk-result');
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => navigate('/')}
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-white/20 transition-all"
        >
          ← Home
        </button>
      </div>
      <RiskCalculator onRiskCalculated={handleRiskCalculated} />
    </div>
  );
}

function RiskResultWrapper() {
  const navigate = useNavigate();
  const { riskData } = useAuth();

  if (!riskData) return <Navigate to="/onboarding" replace />;

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => navigate('/onboarding')}
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-white/20 transition-all"
        >
          ← Back
        </button>
      </div>
      <RiskResultPage
        riskData={riskData}
        onContinue={() => navigate('/plan-selection')}
      />
    </div>
  );
}

function PlanSelectionWrapper() {
  const navigate = useNavigate();
  const { user, riskData, income, setSelectedPlan, setPolicyData } = useAuth();

  if (!riskData) return <Navigate to="/onboarding" replace />;

  const handlePlanSelected = (plan, policy) => {
    setSelectedPlan(plan);
    setPolicyData(policy);
    toast.success('✅ Policy purchased successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => navigate('/risk-result')}
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-white/20 transition-all"
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
        userId={user?.id || user?._id}
      />
    </div>
  );
}

function DashboardWrapper() {
  const navigate = useNavigate();
  const { user, riskData, location, income, selectedPlan, policyData, handleLogout } = useAuth();

  const onLogout = async () => {
    await handleLogout();
    navigate('/');
  };

  return (
    <Dashboard
      user={user}
      riskData={riskData}
      currentLocation={location}
      dailyIncome={income}
      selectedPlan={selectedPlan}
      policyData={policyData}
      onLogout={onLogout}
    />
  );
}

export default App;