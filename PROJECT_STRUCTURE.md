# 📁 GigRakshak AI - Complete Project Structure

```
gigrakshak-ai/
│
├── README.md                           # Project overview
├── COMPLETE_SYSTEM_DOCUMENTATION.md    # System architecture
├── COMPLETE_TESTING_GUIDE.md           # Testing workflows
├── PHASE2_INTEGRATION_GUIDE.md         # Phase 2 complete guide ⭐
│
├── backend/
│   ├── package.json                    # Dependencies (express, mongoose, axios, cors, dotenv)
│   ├── .env                            # Environment variables (MONGO_URI, API_KEY, PORT)
│   ├── .env.example                    # Template
│   ├── server.js                       # Main server file (port 5000)
│   │
│   ├── models/
│   │   ├── User.js                     # Schema: name, location, dailyIncome, platform, riskScore, recommendedPlan
│   │   ├── Policy.js                   # Schema: userId, planType, premium, coverage, startDate, endDate, timestamps
│   │   └── Claim.js                    # Schema: userId, amount, reason, fraudScore, status, timestamps
│   │
│   ├── routes/
│   │   ├── userRoutes.js               # POST /api/users/register
│   │   ├── riskRoutes.js               # POST /api/risk
│   │   ├── pricingRoutes.js            # POST /api/pricing
│   │   ├── policyRoutes.js             # POST /api/policy/buy
│   │   ├── triggerRoutes.js            # POST /api/trigger/check
│   │   └── claimRoutes.js              # POST /api/claim/auto
│   │
│   ├── controllers/
│   │   ├── userController.js           # registerUser() - calls /api/users/register
│   │   ├── riskController.js           # getRisk() - calculates risk score
│   │   ├── pricingController.js        # getPremium() - calculates weekly premium
│   │   ├── policyController.js         # buyPolicy() - creates policy record
│   │   ├── triggerController.js        # checkTrigger() - detects trigger conditions
│   │   └── claimController.js          # autoClaimProcessing() - auto-approves claims
│   │
│   ├── services/
│   │   ├── riskEngine.js               # calculateRisk() - formula implementation
│   │   ├── pricingEngine.js            # calculatePremium() - dynamic pricing
│   │   └── triggerEngine.js            # (legacy, logic moved to controller)
│   │
│   └── utils/
│       └── weather.js                  # getWeatherData(), getAQI(), simulateOrderDrop()
│
├── frontend/
│   ├── package.json                    # Dependencies (react, tailwind, framer-motion, lucide-react)
│   ├── vite.config.js                  # Vite configuration
│   ├── tailwind.config.js              # Tailwind CSS config
│   ├── postcss.config.js               # PostCSS config
│   ├── index.html                      # Root HTML
│   │
│   ├── src/
│   │   ├── main.jsx                    # Entry point
│   │   ├── index.css                   # Global styles
│   │   ├── App.jsx                     # Main router component ⭐
│   │   │                               #   (Controls all page navigation)
│   │   ├── components/
│   │   │   ├── RiskCalculator.jsx      # Risk input form + API call
│   │   │   ├── Features.jsx            # Features component
│   │   │   ├── Footer.jsx              # Footer
│   │   │   ├── Hero.jsx                # Hero section
│   │   │   ├── InputForm.jsx           # Form input
│   │   │   ├── LiveStatsPanel.jsx      # Stats display
│   │   │   ├── Navbar.jsx              # Navigation
│   │   │   ├── PlanCard.jsx            # Plan display card
│   │   │   ├── TriggerAlert.jsx        # Alert component
│   │   │   └── RiskCard.jsx            # Risk score display
│   │   │
│   │   └── pages/
│   │       ├── Landing.jsx             # Landing page (marketing)
│   │       ├── LoginPage.jsx           # Login/Signup (mock auth)
│   │       ├── RegistrationPage.jsx    # ⭐ NEW - Calls /api/users/register
│   │       ├── Onboarding.jsx          # Onboarding flow
│   │       ├── RiskCalculator.jsx      # Risk input (moved here in App)
│   │       ├── RiskResultPage.jsx      # Risk breakdown display
│   │       ├── PlanSelectionPage.jsx   # 3-plan selection UI
│   │       ├── Dashboard.jsx           # 🔥 MAIN APP - Live monitoring
│   │       ├── Purchase.jsx            # Purchase page
│   │       ├── LiveMonitor.jsx         # Live monitoring
│   │       └── RegistrationPage.jsx    # Registration (handles /api/users/register)
│   │
│   └── public/
│       └── assets/                     # Images, icons, etc.
```

---

## 🔗 DATABASE MODELS

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  location: String,
  dailyIncome: Number,
  platform: String,        // "Zomato", "Swiggy", etc.
  riskScore: Number,       // 0-1 scale
  recommendedPlan: String, // "Basic", "Standard", "Pro"
  createdAt: Date,
  updatedAt: Date
}
```

### Policy Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId,        // Reference to User
  planType: String,        // "Basic", "Standard", "Pro"
  premium: Number,         // Weekly cost (₹20-60)
  coverage: Number,        // Policy coverage amount
  startDate: Date,
  endDate: Date,           // 7 days from start
  createdAt: Date,
  updatedAt: Date
}
```

### Claim Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId,        // Reference to User
  amount: Number,          // Payout amount
  reason: String,          // "Heavy rain + order drop"
  fraudScore: String,      // "LOW", "MEDIUM", "HIGH"
  status: String,          // "APPROVED" (always approved!)
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 API ENDPOINTS SUMMARY

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| POST | `/api/users/register` | Register new user | ✅ Working |
| POST | `/api/risk` | Calculate risk score | ✅ Working |
| POST | `/api/pricing` | Get dynamic premium | ✅ Working |
| POST | `/api/policy/buy` | Purchase policy | ✅ Working |
| POST | `/api/trigger/check` | Check trigger conditions | ✅ Working |
| POST | `/api/claim/auto` | Auto-claim processing | ✅ Working |

---

## 🧭 APPLICATION FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Landing Page                                │
│                    (Marketing & "Get Started")                       │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Login Page    │
                    │  (Mock Auth)   │
                    └────────┬───────┘
                             │
                             ▼
        ┌────────────────────────────────────────┐
        │   RegistrationPage ⭐ (NEW)            │
        │   Calls: POST /api/users/register      │
        │   Inputs: name, location, income, platform
        │                                        │
        │   Stores: {                            │
        │     id, name, location, income         │
        │   } in state + localStorage            │
        └────────────┬─────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────┐
        │   RiskCalculator (Onboarding)      │
        │   Calls: POST /api/risk            │
        │   Inputs: location, income         │
        │                                    │
        │   Response: {                      │
        │     riskScore,                     │
        │     riskLevel,                     │
        │     weather,                       │
        │     aqi,                           │
        │     orderDrop,                     │
        │     breakdown,                     │
        │     planRecommendation             │
        │   }                                │
        └────────────┬────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────────────┐
        │   RiskResultPage                        │
        │   Shows: Detailed Risk Breakdown        │
        │   - Weather card                        │
        │   - AQI card                            │
        │   - Metrics card                        │
        │   - Breakdown (expandable)              │
        │   - Recommended plan                    │
        │                                         │
        │   Button: "Continue to Plans"            │
        └────────────┬────────────────────────────┘
                     │
                     ▼
        ┌──────────────────────────────────────────────┐
        │   PlanSelectionPage                          │
        │   Shows: 3 Plans with Comparison              │
        │   - Basic (₹10/day, ₹500)                    │
        │   - Standard (₹20/day, ₹1000)  🌟 Recommended
        │   - Pro (₹40/day, ₹2000)                     │
        │                                              │
        │   Calls: POST /api/policy/buy                │
        │   Inputs: userId, planType, premium          │
        └────────────┬───────────────────────────────────┘
                     │
                     ▼
        ┌──────────────────────────────────────────────┐
        │          Dashboard (MAIN APP) 🔥             │
        │                                              │
        │   Sections:                                  │
        │   1. Live Risk Status (gauge, metrics)       │
        │   2. Test Scenarios (simulation buttons)     │
        │   3. Profile & Coverage info                 │
        │   4. Risk Trend Chart (hourly)               │
        │   5. Trigger Alerts (live feed)              │
        │   6. Auto-Claims (approved payouts)          │
        │                                              │
        │   Buttons:                                   │
        │   - Simulate Rain                            │
        │   - Simulate Order Drop                      │
        │   - Simulate Poor AQI                        │
        │                                              │
        │   When simulator button clicked:             │
        │   1. Update liveData                         │
        │   2. Call POST /api/trigger/check            │
        │   3. If triggered, call POST /api/claim/auto │
        │   4. Display alert & claim                   │
        └──────────────────────────────────────────────┘
```

---

## 💾 STATE MANAGEMENT (App.jsx)

```javascript
// Global State
const [currentView, setCurrentView] = useState('landing')
const [user, setUser] = useState(null)              // From registration
const [riskData, setRiskData] = useState(null)      // From risk API
const [location, setLocation] = useState('')         // From risk form
const [income, setIncome] = useState(0)              // From risk form
const [selectedPlan, setSelectedPlan] = useState(null) // From plan selection

// Local State Persistence
localStorage.setItem('appView', currentView)
localStorage.setItem('user', JSON.stringify(user))
```

---

## 🔄 API CALL SEQUENCE

### Complete Happy Path:
```
1. Login Form Submit
   └─> User data stored locally

2. Registration Form Submit
   └─> POST /api/users/register
       ├─ Request: {name, location, dailyIncome, platform}
       └─ Response: {message, user{_id, ...}}

3. Risk Calculator Submit
   └─> POST /api/risk
       ├─ Request: {location, income}
       └─ Response: {data{riskScore, riskLevel, weather, aqi, orderDrop, breakdown, planRecommendation}}

4. Plan Selection Submit
   └─> POST /api/policy/buy
       ├─ Request: {userId, planType, premium}
       └─ Response: {message, policy{_id, ...}}

5. Dashboard Simulation Button
   └─> Update liveData
       └─> POST /api/trigger/check
           ├─ Request: {location, income, weather, aqi, orderDrop, riskScore}
           └─ Response: {triggered, reason, severity}
               └─ If triggered: POST /api/claim/auto
                   ├─ Request: {userId, income, triggerReason, riskScore}
                   └─ Response: {status: "APPROVED", amount, reason}
                       └─ Display alert & claim in dashboard
```

---

## 📦 DEPENDENCIES

### Backend
```json
{
  "express": "^5.2.1",
  "mongoose": "^9.3.1",
  "cors": "^2.8.6",
  "dotenv": "^17.3.1",
  "axios": "^1.6.0"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "vite": "^latest",
  "tailwindcss": "^3.x",
  "framer-motion": "^10.x",
  "lucide-react": "^latest"
}
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Backend runs without errors (`npm run dev`)
- [ ] Frontend runs without errors (`npm run dev`)
- [ ] MongoDB connection successful
- [ ] All 6 API endpoints working
- [ ] Registration page loads
- [ ] Risk calculation works with real API
- [ ] Plan selection displays correctly
- [ ] Dashboard loads and displays data
- [ ] Simulation buttons trigger API calls
- [ ] Auto-claims appear in dashboard
- [ ] All icons render correctly
- [ ] No console errors
- [ ] Responsive design works
- [ ] localStorage persistence works

---

**All files created and configured for Phase 2 Hackathon Requirements!**
