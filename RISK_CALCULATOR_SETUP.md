# 🚀 Real-Time Risk Calculator - Setup Guide

## 📋 Overview

This implementation adds a **real-time risk calculation system** to GigRakshak AI that:
- 🌤️ Fetches real-time weather data from OpenWeather API
- 🌫️ Calculates Air Quality Index (AQI)
- 📉 Simulates order drop percentages
- 🎯 Computes dynamic risk scores
- 💰 Estimates income impact

---

## 📁 Files Created/Modified

### Backend Files:

1. **`backend/utils/weather.js`** (NEW)
   - Fetches real-time weather data from OpenWeather API
   - Generates mock AQI data
   - Simulates order drop percentages
   - Graceful error handling with fallback mock data

2. **`backend/services/riskEngine.js`** (UPDATED)
   - Updated risk formula: `riskScore = (rain * 0.3) + (aqi * 0.002) + (orderDrop * 0.4)`
   - Risk levels: LOW (< 0.3), MEDIUM (0.3-0.6), HIGH (> 0.6)
   - Detailed factor contributions breakdown
   - Premium multiplier calculation

3. **`backend/controllers/riskController.js`** (UPDATED)
   - New endpoint: `POST /api/risk`
   - Accepts location and income inputs
   - Integrates with weather utility
   - Comprehensive response with weather, AQI, order drop, and risk assessment

4. **`backend/package.json`** (UPDATED)
   - Added `axios` dependency for API calls

### Frontend Files:

1. **`frontend/src/components/RiskCalculator.jsx`** (NEW)
   - Complete form to accept location and income
   - Real-time API integration
   - Beautiful UI with risk visualization
   - Weather insights display
   - AQI and order drop metrics
   - Estimated income loss calculation

---

## ⚙️ Installation & Setup

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install the new `axios` dependency along with existing packages.

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb://localhost:27017/gigrakshak
PORT=5000
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

**For OpenWeather API Key:**
1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the account dashboard
4. Paste it in the `.env` file

**Note:** If you don't have an API key, the system will use mock data automatically.

### Step 3: Start the Backend Server

```bash
# From the backend directory
npm start
# or with nodemon for development
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected ✅
```

### Step 4: Update Frontend to Use RiskCalculator

Edit `frontend/src/pages/Onboarding.jsx` or create a new page and import the RiskCalculator component:

```jsx
import RiskCalculator from '../components/RiskCalculator';

export default function OnboardingPage() {
  return <RiskCalculator />;
}
```

Or add it to your routing in `frontend/src/App.jsx`:

```jsx
import RiskCalculator from './components/RiskCalculator';

// In your routing/view logic:
<RiskCalculator />
```

### Step 5: Start the Frontend

```bash
cd frontend
npm install  # if not already done
npm run dev
```

The frontend will start on `http://localhost:5173` (or your configured port).

---

## 🧪 Testing the API

### Using cURL:

```bash
curl -X POST http://localhost:5000/api/risk \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Bangalore",
    "income": 800
  }'
```

### Using Postman:

1. Create a new POST request
2. URL: `http://localhost:5000/api/risk`
3. Headers: `Content-Type: application/json`
4. Body (JSON):
```json
{
  "location": "Mumbai",
  "income": 1000
}
```

### Expected Response:

```json
{
  "message": "✅ Risk calculated successfully",
  "success": true,
  "data": {
    "riskScore": 0.245,
    "riskLevel": "LOW",
    "recommendation": "Basic",
    "premiumMultiplier": 1.0,
    "weather": {
      "city": "Mumbai",
      "condition": "Cloudy",
      "temperature": 28,
      "humidity": 65,
      "feelsLike": 30,
      "windSpeed": 12,
      "rainInLastHour": 0.5
    },
    "aqi": 85,
    "aqiLevel": "Moderate",
    "orderDrop": 8,
    "estimatedDailyLoss": 80,
    "dailyIncome": 1000,
    "adjustedRiskScore": 0.196,
    "factors": {
      "rainContribution": 0.15,
      "aqiContribution": 0.17,
      "orderDropContribution": 3.2
    },
    "timestamp": "2024-03-26T10:30:00.000Z"
  }
}
```

---

## 🔍 Risk Calculation Formula

```
riskScore = (rain × 0.3) + (aqi × 0.002) + (orderDrop × 0.4)
```

### Risk Levels:
- **LOW**: Score < 0.3 → Basic Plan (1.0x premium)
- **MEDIUM**: Score 0.3–0.6 → Standard Plan (1.2x premium)
- **HIGH**: Score > 0.6 → Pro Plan (1.5x premium)

### Factors Explanation:

| Factor | Range | Multiplier | Impact |
|--------|-------|-----------|--------|
| **Rain** | 0-20 mm | 0.3 | Affects delivery difficulty |
| **AQI** | 0-500 | 0.002 | Air quality matters |
| **Order Drop** | 0-100% | 0.4 | Revenue impact |

---

## 📊 Frontend Features

The `RiskCalculator` component includes:

### 1. Input Form
- Location field (with autocomplete ready)
- Daily income field
- Validation & error handling
- Loading state with spinner

### 2. Risk Card
- Risk score (0-1 scale)
- Risk level badge (LOW/MEDIUM/HIGH)
- Color-coded UI (green/yellow/red)
- Premium multiplier
- Plan recommendation

### 3. Weather Card
- Real-time weather condition
- Temperature & humidity
- Wind speed
- Rainfall in last hour
- "Feels like" temperature

### 4. Metrics Card
- AQI with visual progress bar
- Expected order drop percentage
- Estimated daily income loss
- AQI level interpretation

---

## 🎨 UI Features

- ✨ Glassmorphism design with backdrop blur
- 🎬 Smooth animations using Framer Motion
- 📱 Fully responsive (mobile, tablet, desktop)
- 🌙 Dark theme optimized
- ♿ Accessible with proper labels
- 🔄 Real-time loading states
- 📊 Visual progress bars for metrics

---

## 🚨 Error Handling

The system includes robust error handling:

1. **Missing Inputs**: Validates location and income
2. **Invalid Income**: Checks for positive numeric value
3. **API Failures**: Falls back to mock data automatically
4. **Network Issues**: Displays user-friendly error messages
5. **Invalid Location**: Uses mock data with entered city name

---

## 🧪 Example Test Cases

### Test Case 1: Low Risk (Good Weather)
```json
{
  "location": "Bangalore",
  "income": 500
}
```
Expected: LOW risk, clear weather, low AQI

### Test Case 2: Medium Risk (Moderate Conditions)
```json
{
  "location": "Delhi",
  "income": 800
}
```
Expected: MEDIUM risk, potential rain, moderate AQI

### Test Case 3: High Risk (Poor Conditions)
```json
{
  "location": "Mumbai",
  "income": 1000
}
```
Expected: HIGH risk with monsoon/heavy rain expected

---

## 🔧 Customization

### Change API Base URL
In `RiskCalculator.jsx`, update the fetch URL:
```jsx
const response = await fetch('http://your-backend-url:5000/api/risk', {
```

### Modify Risk Formula
Edit `backend/services/riskEngine.js`:
```js
let riskScore =
  (rain * 0.3) +      // Change multiplier
  (aqi * 0.002) +     // Change multiplier
  (orderDrop * 0.4);  // Change multiplier
```

### Add Real AQI API
Replace mock AQI in `backend/utils/weather.js`:
```js
const aqiResponse = await axios.get(
  `https://api.waqi.info/feed/${city}/?token=YOUR_WAQI_TOKEN`
);
```

---

## 🛠️ Troubleshooting

### Issue: "Cannot Find Module 'axios'"
**Solution:**
```bash
cd backend
npm install axios
```

### Issue: "Risk API Returns Mock Data"
**Solution:** This is normal! The API uses mock data if:
- OpenWeather API key is not set
- OpenWeather API fails
- Network is unreachable

This ensures the app always works.

### Issue: "CORS Error"
**Solution:** Ensure backend CORS is enabled (already configured in `server.js`)

### Issue: "Port 5000 Already in Use"
**Solution:** 
```bash
# Change in .env
PORT=5001
```

---

## 📚 API Documentation

### Endpoint: POST /api/risk

**Request:**
```json
{
  "location": "string (required)",
  "income": "number (required, positive)"
}
```

**Response (Success - 200):**
```json
{
  "message": "✅ Risk calculated successfully",
  "success": true,
  "data": {
    "riskScore": 0.245,
    "riskLevel": "LOW|MEDIUM|HIGH",
    "recommendation": "Basic|Standard|Pro",
    "premiumMultiplier": 1.0,
    "weather": { ... },
    "aqi": 85,
    "aqiLevel": "Good|Moderate|...",
    "orderDrop": 8,
    "estimatedDailyLoss": 80,
    "dailyIncome": 1000,
    "adjustedRiskScore": 0.196,
    "factors": { ... },
    "timestamp": "ISO string"
  }
}
```

**Response (Error - 400/500):**
```json
{
  "message": "❌ Error message",
  "success": false,
  "error": "Error details"
}
```

---

## 🚀 Production Deployment

### Backend (Node.js):
1. Set `NODE_ENV=production`
2. Use a process manager like PM2:
   ```bash
   pm2 start server.js --name "gigrakshak-api"
   ```
3. Use environment variables for sensitive data
4. Set up proper logging

### Frontend (React):
```bash
npm run build
# Deploy the 'dist' folder to your hosting
```

---

## 📞 Support & Contribution

For issues or improvements:
1. Check the troubleshooting section
2. Review API responses for error messages
3. Enable detailed logging for debugging

---

## ✅ Checklist

- [ ] Backend dependencies installed (`npm install` in backend)
- [ ] `.env` file created with OPENWEATHER_API_KEY
- [ ] MongoDB connection configured
- [ ] Backend running on port 5000 (`npm start`)
- [ ] Frontend running on port 5173 (`npm run dev`)
- [ ] RiskCalculator component imported in frontend
- [ ] Tested with sample location and income
- [ ] Verified API returns valid risk data
- [ ] UI displays all metrics correctly

---

## 🎯 Next Steps

After setup, you can enhance the system:
1. **Add Location Autocomplete**: Use Google Maps API
2. **Historical Data**: Store risk calculations in database
3. **Real AQI API**: Integrate WAQI or native OpenWeather AQI
4. **Notifications**: Alert users of high-risk periods
5. **Analytics**: Dashboard showing risk trends
6. **Premium Calculation**: Integrate with pricing engine

---

**Happy Risk Calculating! 🚀**
