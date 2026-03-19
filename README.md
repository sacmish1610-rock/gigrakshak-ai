# 🚀 GigRakshak AI  
### Protecting Every Delivery, Securing Every Earning  

---

## 📌 Problem Statement  

Gig workers, especially food delivery partners (Zomato/Swiggy), face significant income loss due to external disruptions such as heavy rainfall, severe pollution, and social restrictions like curfews or strikes.

Since their earnings are directly dependent on completed deliveries, even short disruptions can lead to major financial instability.

GigRakshak AI solves this problem by providing an **AI-powered parametric insurance platform** that detects real income disruption and automatically compensates workers using intelligent multi-factor analysis.

----
## 👤 Persona-Based Scenario  

### Persona: Ramesh (Food Delivery Partner)

- Platform: Zomato  
- Location: Delhi  
- Daily Earnings: ₹800  

### Scenario:

- Heavy Rainfall = 90mm 🌧️  
- AQI = 320 (Severe Pollution) 🌫️  
- Curfew in locality 🚔  
- Peak Dinner Time (7–10 PM) 🍽️  
- Orders drop by 40% 📉  

### Outcome:

- System detects disruption using hybrid model  
- Income loss is validated using real-time signals  
- ₹300 payout is automatically credited  

---
## 🔄 Application Workflow  

1. User registers with basic details  
2. AI performs risk profiling  
3. Dynamic premium is calculated  
4. User purchases weekly insurance plan  

5. System continuously monitors:
   - Weather data  
   - Pollution levels  
   - Order activity (Mock API)  
   - Social disruption signals  
   - Time-based demand patterns  

6. Hybrid disruption model evaluates income loss  
7. Fraud detection verifies authenticity  
8. Automatic payout is triggered  
9. User views updates on dashboard  

---
## 💸 Weekly Premium Model  

| Plan | Weekly Premium | Coverage |
|------|---------------|----------|
| Basic | ₹20 | ₹500 |
| Standard | ₹30 | ₹1000 |
| Pro | ₹50 | ₹2000 |

### 🔁 Dynamic Pricing  

- High risk → Premium increases  
- Low risk → Premium decreases  

---
## ⚡ Disruption Model (Environmental + Social + Behavioral + Contextual)

GigRakshak AI uses a **multi-factor disruption model** to ensure payouts are triggered only when actual income loss occurs.

---

### 🌧️ 1. Environmental Disruptions  

- Heavy Rainfall 🌧️  
- Severe Pollution (AQI) 🌫️  
- Extreme Heat (optional) 🔥  

**Trigger Conditions:**

Rainfall > 80mm  
AQI > 300  
Temperature > 42°C  

---

### 🚫 2. Social Disruptions  

- Curfew / Movement Restrictions 🚔  
- Local Strikes / Protests 🪧  
- Market / Zone Closures 🏪  

**Trigger Condition:**

SocialDisruption = TRUE  

---

### 📉 3. Behavioral Indicator (Core Signal)  

- Order Drop (Primary indicator of income loss)  

Example:

Normal Orders = 20  
Current Orders = 10  
→ Order Drop = 50%  

---

### ⏱️ 4. Contextual Factors (Innovation)  

- Peak Delivery Hours (Lunch/Dinner) 🍽️  
- Location-based risk zones 📍  

---
## 🔥 Hybrid Parametric Trigger Logic  

IF (Rainfall > threshold AND Order Drop > 30%)  
OR (AQI > 300 AND Order Drop > 25%)  
OR (Peak Hours AND Order Drop > 35%)  
OR (Social Disruption = TRUE AND Order Drop > 20%)  
OR (Order Drop > 50%)  
→ Trigger payout  

### 💡 Key Insight  

The system ensures payouts are triggered only when disruptions actually result in income loss, using order drop as the primary validation signal.

---
## 🤖 AI/ML Integration  

### 1. Risk Prediction  
- Predicts disruption probability  
- Estimates expected income loss  

### 2. Dynamic Pricing Engine  
- Adjusts premium based on risk score  

### 3. Fraud Detection  
- Detects:
  - Fake location  
  - Weather mismatch  
  - Data inconsistency  

### 4. AI Work Recommendation (Unique Feature)  
- Suggests optimal working strategy  
- Example:
  “Avoid evening shift due to heavy rain risk”  

---
## 🛠️ Tech Stack  

Frontend: React.js, Tailwind CSS  
Backend: Node.js, Express.js  
Database: MongoDB  

APIs:  
- OpenWeather API  
- AQI API  
- Mock Order API  
- Mock Social Disruption API  

---
## 🧪 Development Plan  

Phase 1: Ideation + README  
Phase 2: Backend + trigger system  
Phase 3: AI + dashboard + payout system  

---

## 🎯 Key Features  

- AI Income Loss Prediction  
- Dynamic Premium Pricing  
- Hybrid Multi-Factor Trigger System  
- Fraud Detection System  
- Automated Payout  
- AI Work Recommendation  

---

## 🌍 Impact  

- Provides financial protection to gig workers  
- Reduces income instability  
- Enables fast and fair compensation  
- Builds trust in digital insurance systems  

---
## 🎥 Demo Video  

Link will be added here  

---

## 📌 Additional Notes  

- Real delivery APIs are not publicly available, so mock APIs are used  
- System focuses only on income protection  
- Not covering health, accident, or vehicle insurance  

---
