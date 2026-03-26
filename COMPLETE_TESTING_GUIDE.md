# 🚀 GigRakshak AI - Quick Start & Complete Testing Guide

## ⚡ Quick Start (5 Minutes)

### 1️⃣ Backend Setup
```bash
cd backend
npm install
npm start
```
✅ Backend runs on `http://localhost:5000`

### 2️⃣ Frontend Setup (New Terminal)
```bash
cd frontend
npm run dev
```
✅ Frontend runs on `http://localhost:5173`

### 3️⃣ Open in Browser
```
http://localhost:5173
```

✅ **You're ready to go!**

---

## 🧪 Complete Testing Workflow

### Phase 1: User Authentication (2 min)

**Step 1: Landing Page**
- Click "Get Started" button
- System navigates to Login page

**Step 2: Login**
- Option 1: Use demo credentials
  - Email: `demo@gigrakshak.com`
  - Password: `demo123`
- Option 2: Create new account with any email/password

**Expected:** Redirects to Onboarding with location + income form

---

### Phase 2: Risk Calculation (2 min)

**Step 1: Enter Location & Income**
```
Location: Bangalore
Daily Income: ₹800
```
Click: **Calculate Risk**

**Step 2: Observe Risk Calculation**
- System fetches real weather data
- Calculates AQI (or uses mock if API unavailable)
- Simulates order drop
- Returns comprehensive breakdown

**Expected Output:**
```
Risk Score: 0.25
Risk Level: LOW
Weather: Clear, 28°C
AQI: 85
Order Drop: 8%
Estimated Loss: ₹64
```

---

### Phase 3: Risk Breakdown (2 min)

**Step 1: Review Risk Result Screen**
See three cards:
- 🎯 Risk Card (BIG, with gauge)
- 🌤️ Weather Card
- 📊 Impact Metrics Card

**Step 2: Expand Detailed Breakdown**
- Click toggle
- See breakdown table:
  - Rain Impact: 0.15
  - AQI Impact: 0.08
  - Order Impact: 3.2
  - Total: 0.245

**Step 3: View Plan Benefits**
- See recommended plan features
- Read description
- Understand coverage

**Click:** Continue to Plans

---

### Phase 4: Plan Selection (1 min)

**Step 1: See 3 Plans**
- **Basic Plan** (₹10/day)
  - ₹500 coverage
  - 50% income protection
  
- **Standard Plan** ⭐ (₹20/day) [RECOMMENDED FOR LOW RISK]
  - ₹1000 coverage
  - 60% income protection
  - Auto-claim enabled
  
- **Pro Plan** (₹40/day)
  - ₹2000 coverage
  - 80% income protection
  - 24/7 support

**Step 2: Select Plan**
- Standard Plan is highlighted as recommended
- Click "Select Plan"
- Button shows: "✓ Selected"

**Step 3: Compare Plans**
- Scroll down to see comparison table
- All features side-by-side

**Click:** Buy Policy

**Expected:** Policy purchased, redirects to Dashboard

---

### Phase 5: Dashboard - Live Monitoring (5 min)

**Main Dashboard Sections:**

#### Section 1: Live Risk Status (LEFT)
```
Current Risk Score: 0.15
Risk Gauge: Green (LOW)

Status:
🌤️ Weather: Clear
🌡️ Temp: 28°C
🌫️ AQI: 85
📉 Order Drop: 0%
```

#### Section 2: Test Buttons (MIDDLE)
Three simulation buttons:
- 🌧️ **Simulate Rain**
- 📉 **Simulate Order Drop**
- ⚠️ **Simulate Poor AQI**

#### Section 3: Coverage Info (RIGHT)
```
📍 Location: Bangalore
💰 Daily Income: ₹800
💼 Active Plan: Standard
✅ Coverage: 7 days active
  Next Eligible Payout: ₹480
```

#### Section 4: Risk Trend (BOTTOM LEFT)
Shows hourly risk progression with gauges

#### Section 5: Alerts & Claims (BOTTOM RIGHT)
- 🚨 Trigger Alerts (0)
- 💰 Auto-Claims (0)

---

### Phase 6: Test Trigger System (3 min)

**Test Case 1: Simulate Rain**

**Action:**
- Click button: 🌧️ **Simulate Rain**

**What Happens:**
1. Live data updates:
   ```
   Weather: Rainy
   Rainfall: 8mm
   AQI: +30 (pollution)
   Order Drop: 35% (increases)
   ```
2. Risk score increases:
   ```
   New Risk Score: 0.42
   Risk Level: MEDIUM
   ```
3. Notification appears:
   ```
   ⚡ Simulating rain conditions...
   ```

**Expected Result in Alerts Section:**
```
🚨 Trigger Alert
Reason: Heavy rain + high order drop
Severity: HIGH
Status: Claim processed ✓
```

---

**Test Case 2: Order Drop Detected**

**Action:**
- Click button: 📉 **Simulate Order Drop**

**What Happens:**
1. Live data updates:
   ```
   Order Drop: 65%
   Estimated Loss: ₹520
   ```
2. Risk increases:
   ```
   New Risk Score: 0.48
   Risk Level: MEDIUM
   ```

**Expected Result:**
Check Alerts section for:
```
🚨 Order drop detected
Reason: Extreme order drop
Severity: HIGH
```

---

**Test Case 3: Extreme Conditions**

**Action:**
- Click: 🌧️ **Simulate Rain**
- Click: 📉 **Simulate Order Drop**
- Click: ⚠️ **Simulate Poor AQI**

**Expected:**
```
Multiple triggers activated
Risk Score: 0.85+
Risk Level: HIGH
Several claims processed
Total paid out: ₹1200+
```

---

### Phase 7: Verify Auto-Claims (2 min)

**Look at: "💰 Auto-Claims" Section**

**For Each Trigger, you should see:**
```
✅ ₹480 Credited
   Reason: Order drop detected
   Status: APPROVED
   
✅ ₹320 Credited
   Reason: Rain + Order Drop
   Status: APPROVED
```

**Each claim shows:**
- ✅ Green checkmark (APPROVED)
- Amount based on risk score
- Instant processing (no delay)

---

## 🔍 Detailed Feature Testing

### Test 1: Risk Breakdown Transparency

**Navigate to:** Risk Result Screen

**Test:**
1. View risk card with score
2. Click "🧠 Risk Calculation Breakdown"
3. Expand shows:
   - 🌧️ Rain Impact
   - 🌫️ AQI Impact
   - 📉 Order Drop Impact
4. Click again to expand technical details
5. See all calculations with explanations

**What to Verify:**
- All impacts sum to total risk score
- Formula is visible: `rain×0.3 + aqi×0.002 + drop×0.4`
- Users understand calculation ✅

---

### Test 2: Plan Recommendation Accuracy

**Test Scenarios:**

**Scenario A: Low Risk**
- Location: Bangalore
- Risk Score: < 0.3
- Expected Recommendation: **Basic Plan**
- Check: Recommended badge on Basic card ✅

**Scenario B: Medium Risk**
- Location: Mumbai
- Risk Score: 0.3-0.6
- Expected Recommendation: **Standard Plan**
- Check: Recommended badge on Standard card ✅

**Scenario C: High Risk**
- Simulate rain + order drop
- Risk Score: > 0.6
- Expected Recommendation: **Pro Plan**
- Check: Recommended badge on Pro card ✅

---

### Test 3: Auto-Claim Calculation Accuracy

**Test Case:**

**Setup:**
- Income: ₹1000
- Trigger: Rain

**Expected Claim Amount:**
```
Risk Score: 0.52 (MEDIUM)
Formula: income × 0.6 = ₹600

Check Dashboard: "💰 ₹600 Credited" ✅
```

**Test Another:**
- Income: ₹500
- Multiple triggers (Risk Score: 0.75)
- Expected: intake × 0.75 (not exceeding plan max)

---

### Test 4: Dashboard Real-Time Updates

**Action:**
1. Open Dashboard
2. Click: 🌧️ Simulate Rain
3. Watch live data update:
   - Weather field changes ✅
   - Temperature stays/updates ✅
   - AQI changes ✅
   - Order Drop updates ✅
   - Risk score recalculates ✅
   - Gauge color changes ✅

**Speed Test:**
- All updates should be instant (< 1 second)
- Smooth animations ✅

---

## 📋 Complete Checklist

### Backend Testing

```
POST /api/risk
✅ Accepts location + income
✅ Fetches weather data
✅ Calculates AQI
✅ Simulates order drop
✅ Returns risk score
✅ Includes breakdown
✅ Recommends plan
✅ Handles errors gracefully

POST /api/trigger/check
✅ Evaluates trigger conditions
✅ Returns trigger status
✅ Includes severity level
✅ Shows reason

POST /api/claim/auto
✅ Creates claim record
✅ Calculates amount correctly
✅ Sets status to APPROVED
✅ Returns claim ID
✅ Includes notification

POST /api/policy/buy
✅ Stores policy in database
✅ Sets coverage amount
✅ Sets active dates
✅ Returns policy object
```

### Frontend Testing

```
Landing Page
✅ Displays marketing content
✅ "Get Started" button works
✅ Navigates to login

Login Page
✅ Form validation works
✅ Signup/Signin toggle works
✅ Stores user in localStorage
✅ Navigates to onboarding

Onboarding
✅ Location input accepts text
✅ Income input accepts numbers
✅ Form validation works
✅ API call executes
✅ Loading state displays
✅ Error handling works

Risk Result Page
✅ Shows risk card
✅ Shows weather card
✅ Shows metrics card
✅ Breakdown expandable
✅ Continue button works
✅ All calculations correct

Plan Selection
✅ Shows 3 plans
✅ Recommended plan highlighted
✅ Select plan button works
✅ Comparison table displays
✅ Buy button processes
✅ Navigates to dashboard

Dashboard
✅ Live risk status updates
✅ Simulation buttons work
✅ Rain simulation increases risk
✅ Order drop simulation works
✅ AQI simulation works
✅ Alerts display correctly
✅ Claims display correctly
✅ Risk trend chart shows
```

---

## 🐛 Troubleshooting

### Backend Not Responding

**Problem:** "Cannot reach backend"

**Solution:**
```bash
# Check if backend is running
netstat -an | grep 5000

# Restart backend
cd backend
npm start
```

### Frontend Can't Call API

**Problem:** "Failed to calculate risk"

**Solution:**
1. Check backend URL in RiskCalculator.jsx
   ```javascript
   const response = await fetch('http://localhost:5000/api/risk'
   ```
2. Verify CORS is enabled in server.js
3. Check browser console for errors

### Weather API Not Working

**Problem:** "Getting mock data instead of real weather"

**Solution:**
- Expected behavior! System falls back to mock data
- To use real API: Add OpenWeather API key to .env
- Verify API key is valid

### Simulation Doesn't Trigger Claims

**Problem:** "Clicked simulate rain but no claim appeared"

**Solution:**
1. Check trigger conditions (might not meet threshold)
2. Open browser console
3. Check API responses
4. Try extreme simulation (multiple buttons)

### Database Connection Error

**Problem:** "Cannot connect to MongoDB"

**Solution:**
```bash
# Verify MongoDB running
# Update MONGO_URI in .env
# Restart backend
npm start
```

---

## 📊 Performance Metrics

### Expected Load Times

**Risk Calculation:** < 1 second
```
- Weather fetch: 300-500ms
- AQI calc: ~ 50ms
- Risk formula: < 5ms
- Total: ~500ms
```

**Plan Display:** Instant
```
- Risk → Plan: < 500ms
```

**Dashboard Update:** Instant
```
- Simulation → Update: < 100ms
```

**Auto-Claim Processing:** < 2 seconds
```
- Trigger check: ~200ms
- Claim creation: ~500ms
- Response: < 1 second
```

---

## 🎓 Key Testing Insights

### What Proves the System Works

1. **Risk Calculation**
   - ✅ Weather data fetched
   - ✅ AQI calculated
   - ✅ Order drop simulated
   - ✅ Risk score accurate

2. **Transparency**
   - ✅ Breakdown visible
   - ✅ Formula explained
   - ✅ Each impact shown
   - ✅ Users understand calculation

3. **Plan Recommendation**
   - ✅ Matches risk level
   - ✅ Highlighted correctly
   - ✅ Features listed
   - ✅ Premium displayed

4. **Auto-Claims**
   - ✅ Trigger detects conditions
   - ✅ Claim amount calculated
   - ✅ Instant approval
   - ✅ Zero human intervention

5. **Live Monitoring**
   - ✅ Real-time updates
   - ✅ Smooth animations
   - ✅ Accurate gauge
   - ✅ Alerts displayed

---

## 🚀 Success Criteria

Your system is **PRODUCTION READY** when:

- ✅ All 7 testing phases pass
- ✅ No console errors
- ✅ All API responses correct
- ✅ UI responsive on mobile
- ✅ Calculations accurate
- ✅ Auto-claims instant
- ✅ User flow smooth
- ✅ Error handling graceful

---

## 📞 Support

If any test fails:
1. Check COMPLETE_SYSTEM_DOCUMENTATION.md
2. Review backend logs
3. Check browser console
4. Verify all files created
5. Check API endpoints active

---

**Ready to demo? You're all set! 🎉**
