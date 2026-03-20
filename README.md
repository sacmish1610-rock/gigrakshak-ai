# 🚀 GigRakshak AI  
### Protecting Every Delivery, Securing Every Earning  

---

## 📌 Problem Statement  

Food delivery partners (Zomato/Swiggy) rely entirely on daily earnings. External disruptions such as heavy rain, pollution, and curfews can reduce their working hours and cause significant income loss.

Currently, there is no system that automatically protects their income during such situations.

GigRakshak AI is an AI-powered parametric insurance platform designed to provide **real-time income protection**, automated payouts, and a seamless user experience.

---
## 👤 Persona-Based Scenario  

### Persona: Ramesh (Food Delivery Partner)

- Platform: Zomato  
- Location: Delhi  
- Daily Earnings: ₹800  

### Scenario:

- Rainfall = 90mm 🌧️  
- AQI = 320 🌫️  
- Curfew in locality 🚔  
- Orders drop by 40% 📉  

### Outcome:

- System detects disruption using hybrid model  
- Income loss validated  
- ₹300 payout automatically credited  

---
## 🔄 Application Workflow  

1. User registers with basic details  
2. System fetches location-based risk (weather + pollution)  
3. AI calculates risk score  
4. Dynamic premium is generated  
5. User selects weekly insurance plan  

6. System continuously monitors:
   - Weather data  
   - Pollution levels  
   - Order activity (Mock API)  
   - Social disruptions  
   - Peak hour demand  

7. Hybrid trigger detects income loss  
8. Fraud detection validates claim  
9. Automatic payout is processed (zero-touch)  

---
## 💸 Weekly Premium Model  

| Plan | Weekly Premium | Coverage |
|------|---------------|----------|
| Basic | ₹20 | ₹500 |
| Standard | ₹30 | ₹1000 |
| Pro | ₹50 | ₹2000 |

### 🔁 Dynamic Pricing (AI-Based)

- Premium changes based on risk level  
- High risk → Premium increases  
- Low risk → Premium decreases  

Example:
“Premium increased by ₹5 due to high rain probability this week”

---
## 🧠 AI Risk Scoring System  

Risk is calculated using multiple real-world factors:

Risk Score =  
( Rain × 0.3 ) +  
( AQI × 0.2 ) +  
( Order Drop × 0.4 ) +  
( Peak Hours × 0.1 )  

### 🎯 Output:

- Low Risk (Green)  
- Medium Risk (Yellow)  
- High Risk (Red)  

This provides a real AI-driven experience instead of rule-based logic.

---
## ⚡ Disruption Model  

GigRakshak AI uses a multi-factor disruption system:

### 🌧️ Environmental  
- Heavy Rain  
- Pollution  

### 🚫 Social  
- Curfew  
- Strike  
- Zone Closure  

### 📉 Behavioral  
- Order Drop (primary signal of income loss)  

### ⏱️ Contextual  
- Peak hours (lunch/dinner)  

---
## 🔥 Hybrid Parametric Trigger Logic  

IF (Rainfall > threshold AND Order Drop > 30%)  
OR (AQI > 300 AND Order Drop > 25%)  
OR (Peak Hours AND Order Drop > 35%)  
OR (Social Disruption = TRUE AND Order Drop > 20%)  
OR (Order Drop > 50%)  
→ Trigger payout  

### 💡 Key Insight  

Payout is triggered only when real income loss is detected.

---
## 💰 Zero-Touch Claim System  

The system eliminates manual claim filing.

### Flow:

- Disruption detected  
- Claim automatically created  
- Fraud check performed  
- Payout processed instantly  

### UX Message:

“No action needed. Your earnings are protected.”

---
## 🛡️ Fraud Detection System  

The system prevents misuse using:

- Location validation  
- Order activity verification  
- Behavior pattern analysis  
- Duplicate claim detection  

### Fraud Score:

- Low  
- Medium  
- High  

This ensures system reliability and prevents false payouts.

---
## 📊 Dashboard  

### 👨‍🍳 Worker Dashboard  

- Today’s Earnings Protected  
- Risk Level (Low / Medium / High)  
- Active Insurance Plan  
- Payout History  

### 🧑‍💼 Admin Dashboard  

- Total payouts  
- Risk heatmap  
- Active disruptions  
- Fraud alerts  

---
## 🛠️ Tech Stack  

Frontend: React.js, Tailwind CSS  
Backend: Node.js, Express.js  
Database: MongoDB  

APIs:  
- Weather API  
- AQI API  
- Mock Order API  
- Mock Social API  

---
## 🎯 Key Features  

- AI Risk Prediction  
- Dynamic Pricing  
- Hybrid Trigger System  
- Zero-Touch Claims  
- Fraud Detection  
- Automated Payout  

---

## 🌍 Impact  

- Financial protection for gig workers  
- Fast and fair compensation  
- No manual claim process  
- Real-world scalable solution  

---
## 🎥 Demo Video  

Link will be added here  

---

## 📌 Note  

This system focuses only on income loss and does not cover health, accident, or vehicle insurance.

---
