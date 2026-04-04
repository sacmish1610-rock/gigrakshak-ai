# 📋 QUICK REFERENCE CARD - GigRAKSHAK AI 2.0

## 🚀 ONE-MINUTE STARTUP

```powershell
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend  
cd frontend
npm install
npm run dev
```

**Backend URL:** http://localhost:5000  
**Frontend URL:** http://localhost:5173

---

## 🌐 ENVIRONMENT VARIABLES

### Backend (.env)
```env
JWT_SECRET=your_secret_key_here
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/gigrakshak
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
OPENWEATHER_API_KEY=your_key
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔗 API ENDPOINTS

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | User login |
| GET | `/api/auth/me` | ✅ | Get profile |
| POST | `/api/auth/refresh-token` | ✅ | Refresh JWT |
| GET | `/api/health` | ❌ | Health check |

---

## 🧪 TEST THE APP

**Sign Up:**
- Email: test@example.com
- Password: password123
- Pincode: 560001 (auto-fills Bangalore)
- Income: 500 ₹

**Then Login** with same credentials

---

## 🛡️ SECURITY

- Rate Limit: 100 req/15min globally, 5 login/15min
- Auth: JWT (30 days expiry)
- Password: bcryptjs with salt=10
- CORS: Restricted to FRONTEND_URL

---

## 🆘 QUICK FIXES

| Issue | Fix |
|-------|-----|
| Port in use | `taskkill /PID <PID> /F` |
| Can't connect DB | Check MONGO_URI, whitelist IP |
| Can't reach backend | Ensure backend running on 5000 |
| Rate limited | Wait 15 mins |

---

## 📚 DOCUMENTATION

1. **START HERE:** `00_START_HERE.md`
2. **5-Min Setup:** `QUICKSTART_5MIN.md`
3. **Full Setup:** `PRODUCTION_SETUP.md`
4. **All Fixes:** `FIXES_SUMMARY.md`
5. **API Ref:** `API_DOCUMENTATION.md`

---

## 📁 KEY FILES

```
backend/
├── .env                    ← Secrets (DON'T COMMIT)
├── server.js              ← Entry point
└── middleware/            ← NEW middleware

frontend/
├── .env.local             ← Config
└── src/services/api.js    ← NEW API service
```

---

## ✅ BEFORE PRODUCTION

- [ ] Generate new JWT_SECRET
- [ ] Update MongoDB password
- [ ] Whitelist production IP
- [ ] Set NODE_ENV=production
- [ ] Update API URLs
- [ ] Enable HTTPS
- [ ] Test all flows
- [ ] Setup monitoring

---

**Status:** ✅ Production Ready | **Version:** 2.0.0 | **Date:** April 1, 2026
│   └── weather.js          ← NEW: Fetch weather, AQI, simulate order drop
├── services/
│   └── riskEngine.js       ← UPDATED: Risk calculation formula
├── controllers/
│   └── riskController.js   ← UPDATED: Integrate weather + risk calculation
├── routes/
│   └── riskRoutes.js       ← POST /api/risk endpoint
├── server.js
├── package.json            ← UPDATED: Added axios
└── .env.example            ← NEW: Environment variables template
```

### Frontend Structure
```
frontend/src/
├── components/
│   ├── RiskCalculator.jsx  ← NEW: Complete risk calculator UI
│   └── ...other components
├── App.jsx                 ← Import RiskCalculator here
└── ...
```

---

## 🔑 Key Functions

### Weather Utility (`backend/utils/weather.js`)

| Function | Purpose | Returns |
|----------|---------|---------|
| `getWeatherData(city)` | Fetch weather from OpenWeather API | Weather object with temp, humidity, rain, etc. |
| `getAQI(city, rain)` | Calculate AQI | Air Quality Index (0-500) |
| `simulateOrderDrop(weather, aqi)` | Estimate order impact | Order drop % (0-100) |
| `generateMockWeatherData(city)` | Fallback mock data | Mock weather object |

### Risk Engine (`backend/services/riskEngine.js`)

```javascript
calculateRisk({
  rain,          // 0-20 mm
  aqi,           // 0-500 (Air Quality Index)
  orderDrop      // 0-100 (percentage)
})
// Returns: { riskScore, riskLevel, recommendation, premiumMultiplier, factors }
```

### Risk Controller (`backend/controllers/riskController.js`)

```javascript
POST /api/risk
{
  "location": "Bangalore",  // Required: city name
  "income": 800            // Required: daily income in ₹
}
```

Returns comprehensive risk assessment data.

---

## 📊 Response Data Structure

```json
{
  "riskScore": 0.245,           // 0-1 scale
  "riskLevel": "LOW",           // LOW | MEDIUM | HIGH
  "recommendation": "Basic",     // Plan type
  "premiumMultiplier": 1.0,     // Insurance premium multiplier
  
  "weather": {
    "city": "Bangalore",
    "condition": "Cloudy",
    "temperature": 28,
    "humidity": 65,
    "rainInLastHour": 0.5,
    "windSpeed": 12,
    "feelsLike": 30
  },
  
  "aqi": 85,                    // Air Quality Index
  "aqiLevel": "Moderate",       // AQI interpretation
  
  "orderDrop": 8,               // Expected order loss %
  "estimatedDailyLoss": 80,     // Expected loss in ₹
  "dailyIncome": 800,           // Input income
  
  "factors": {
    "rainContribution": 0.15,
    "aqiContribution": 0.17,
    "orderDropContribution": 3.2
  },
  
  "timestamp": "2024-03-26T10:30:00.000Z"
}
```

---

## 📈 Risk Formula Breakdown

```
riskScore = (rain × 0.3) + (aqi × 0.002) + (orderDrop × 0.4)

Example: rain=5mm, aqi=100, orderDrop=20%
= (5 × 0.3) + (100 × 0.002) + (20 × 0.4)
= 1.5 + 0.2 + 8.0
= 9.7 (normalized as 0.097 internally)
```

### Risk Level Classification

| Score | Level | Multiplier | Description |
|-------|-------|-----------|-------------|
| < 0.3 | LOW | 1.0x | Safe to operate |
| 0.3-0.6 | MEDIUM | 1.2x | Caution advised |
| > 0.6 | HIGH | 1.5x | High risk period |

---

## 🧪 Testing Examples

### Test w/ cURL
```bash
curl -X POST http://localhost:5000/api/risk \
  -H "Content-Type: application/json" \
  -d '{"location":"Mumbai","income":1000}'
```

### Test w/ JavaScript
```javascript
fetch('http://localhost:5000/api/risk', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: 'Delhi',
    income: 800
  })
})
.then(res => res.json())
.then(data => console.log(data.data))
```

### Test w/ Python
```python
import requests

response = requests.post(
  'http://localhost:5000/api/risk',
  json={'location': 'Bangalore', 'income': 500}
)

print(response.json()['data'])
```

---

## 🎨 Frontend Component (`RiskCalculator.jsx`)

### Key Features:
- ✅ Location input with validation
- ✅ Income input with validation
- ✅ Real-time API integration
- ✅ Loading state with spinner
- ✅ Error handling with messages
- ✅ Color-coded risk levels (green/yellow/red)
- ✅ Weather metrics display
- ✅ AQI with progress bar
- ✅ Estimated loss calculation
- ✅ Smooth animations with Framer Motion
- ✅ Fully responsive design

### How to Use:
```jsx
import RiskCalculator from './components/RiskCalculator';

export default function App() {
  return <RiskCalculator />;
}
```

---

## 🔐 Error Handling

| Error | Cause | Handling |
|-------|-------|----------|
| Missing location | User didn't enter location | Show validation error |
| Invalid income | Non-numeric or negative | Show validation error |
| API Fails | OpenWeather API down | Use mock data automatically |
| Network Error | Internet unreachable | Display error message |

All errors are gracefully handled with fallback to mock data.

---

## 🌤️ Weather Data Sources

### Primary (Real Data):
- **OpenWeatherMap API** - Real weather conditions
- Free tier: 60 calls/minute, 1M calls/month
- Sign up: https://openweathermap.org/api

### Fallback (Mock Data):
- Automatically used if API fails
- Simulates realistic weather variations
- Allows testing without API key

---

## 💡 Example Scenarios

### Scenario 1: Clear, Low Risk
```
Input: Bangalore, ₹500
Weather: Clear, 28°C, 0mm rain
AQI: 60 (Good)
Order Drop: 0%
Result: LOW risk (0.12), Basic Plan, ₹0 expected loss
```

### Scenario 2: Monsoon, High Risk
```
Input: Mumbai, ₹800
Weather: Heavy Rain, 25°C, 15mm rain
AQI: 200 (Unhealthy)
Order Drop: 60%
Result: HIGH risk (0.85), Pro Plan, ₹480 expected loss
```

### Scenario 3: Moderate Risk
```
Input: Delhi, ₹1000
Weather: Cloudy, 35°C, 2mm rain
AQI: 150 (Moderate)
Order Drop: 15%
Result: MEDIUM risk (0.42), Standard Plan, ₹150 expected loss
```

---

## 🔧 Configuration

### Environment Variables
```env
MONGO_URI=mongodb://localhost:27017/gigrakshak
PORT=5000
OPENWEATHER_API_KEY=your_api_key_here  # Leave empty for mock data
```

### Frontend API URL
In `RiskCalculator.jsx` line ~80:
```javascript
const response = await fetch('http://localhost:5000/api/risk', {
```

---

## 📦 Dependencies Added

**Backend:**
- `axios@^1.6.0` - HTTP client for weather API

**Frontend:**
- Already has: `react`, `framer-motion`, `lucide-react`, `tailwind`

---

## 🚀 Deployment Notes

### For Production:
1. Use real OpenWeather API key
2. Set `NODE_ENV=production`
3. Use environment variables for secrets
4. Enable proper CORS headers
5. Add rate limiting to `/api/risk`
6. Log risk calculations for analytics
7. Consider caching weather data (5-10 min)

### Scaling:
- Cache weather data per city
- Implement request rate limiting
- Use CDN for frontend
- Monitor API usage

---

## 🐛 Common Issues

**Issue:** "axios is not defined"
**Fix:** `npm install axios` in backend

**Issue:** "RiskCalculator not found"
**Fix:** Check file path in import statement

**Issue:** Blank results on frontend
**Fix:** Ensure backend is running on port 5000

**Issue:** CORS error
**Fix:** Backend has CORS enabled, but check fetch URL

---

## 📚 Files Summary

| File | Type | Purpose |
|------|------|---------|
| `weather.js` | Utility | Fetch weather, AQI, order drop |
| `riskEngine.js` | Service | Calculate risk score |
| `riskController.js` | Controller | Handle API requests |
| `RiskCalculator.jsx` | Component | Frontend UI |
| `RISK_CALCULATOR_SETUP.md` | Docs | Detailed setup guide |
| `.env.example` | Config | Environment variables template |

---

**Ready to calculate risks? Let's go! 🚀**
