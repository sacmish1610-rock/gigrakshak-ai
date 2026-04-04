# 📚 GigRAKSHAK AI - API DOCUMENTATION

Complete API reference for all endpoints.

---

## 🔐 AUTHENTICATION ENDPOINTS

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Create new user account

**Request Body:**
```json
{
  "name": "Ramesh Kumar",
  "email": "ramesh@example.com",
  "password": "password123",
  "phone": "9876543210",
  "pincode": "560001",
  "city": "Bangalore",
  "state": "Karnataka",
  "workType": "Zomato",
  "vehicleType": "Bike",
  "experience": 3,
  "income": 500
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "✅ Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Ramesh Kumar",
      "email": "ramesh@example.com",
      "workType": "Zomato",
      "riskScore": 28,
      "recommendedPlan": "Standard"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "❌ Email already registered"
}
```

**Validation Rules:**
- `name`: Required, min 2 chars
- `email`: Required, valid email format, unique
- `password`: Required, min 6 chars
- `pincode`: Required, exactly 6 digits
- `workType`: Required, one of [Zomato, Swiggy, Zepto, Blinkit, Amazon, Flipkart, Dunzo, Uber Eats, Other]
- `income`: Required, positive number

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and get JWT token

**Request Body:**
```json
{
  "email": "ramesh@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "✅ Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Ramesh Kumar",
      "email": "ramesh@example.com",
      "workType": "Zomato",
      "income": 500,
      "riskScore": 28,
      "recommendedPlan": "Standard",
      "city": "Bangalore",
      "state": "Karnataka"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "❌ Invalid email or password"
}
```

---

### 3. Get Current User (Protected)

**Endpoint:** `GET /api/auth/me`

**Description:** Get profile of authenticated user

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "✅ User retrieved",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Ramesh Kumar",
      "email": "ramesh@example.com",
      "phone": "9876543210",
      "pincode": "560001",
      "city": "Bangalore",
      "state": "Karnataka",
      "workType": "Zomato",
      "vehicleType": "Bike",
      "experience": 3,
      "income": 500,
      "riskScore": 28,
      "recommendedPlan": "Standard",
      "createdAt": "2026-04-01T10:00:00.000Z",
      "updatedAt": "2026-04-01T10:00:00.000Z"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "❌ Not authorized, no token provided"
}
```

---

### 4. Refresh Token (Protected)

**Endpoint:** `POST /api/auth/refresh-token`

**Description:** Get new JWT token (current token must be valid)

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "✅ Token refreshed",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 📊 RISK ENDPOINTS

### 5. Calculate Risk

**Endpoint:** `POST /api/risk/calculate`

**Description:** Calculate risk score based on weather and order data

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "location": "Bangalore",
  "temperature": 32,
  "humidity": 65,
  "rainProbability": 0.3,
  "aqi": 150,
  "orderDropPercentage": 20
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "✅ Risk calculated",
  "data": {
    "riskScore": 0.42,
    "riskLevel": "MEDIUM",
    "breakdown": {
      "weatherRisk": 0.25,
      "pollutionRisk": 0.45,
      "orderDropRisk": 0.20
    },
    "planRecommendation": "Standard"
  }
}
```

---

## 💰 PRICING ENDPOINTS

### 6. Get Plans

**Endpoint:** `GET /api/pricing/plans`

**Description:** Get all available insurance plans

**Response (200):**
```json
{
  "success": true,
  "message": "✅ Plans retrieved",
  "data": {
    "plans": [
      {
        "id": "basic",
        "name": "Basic",
        "coverage": 1000,
        "premium_weeklyLow": 20,
        "premium_weeklyHigh": 35,
        "features": [
          "Coverage on rain",
          "7-day validity"
        ]
      },
      {
        "id": "standard",
        "name": "Standard",
        "coverage": 3000,
        "premium_weeklyLow": 35,
        "premium_weeklyHigh": 50,
        "features": [
          "Coverage on rain & pollution",
          "7-day validity"
        ]
      },
      {
        "id": "pro",
        "name": "Pro",
        "coverage": 5000,
        "premium_weeklyLow": 50,
        "premium_weeklyHigh": 60,
        "features": [
          "Full coverage",
          "7-day validity",
          "Priority claims"
        ]
      }
    ]
  }
}
```

---

### 7. Calculate Price

**Endpoint:** `POST /api/pricing/calculate`

**Description:** Get price for a plan based on risk score

**Request Body:**
```json
{
  "riskScore": 0.42
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "✅ Price calculated",
  "data": {
    "basicPremium": 25,
    "standardPremium": 42,
    "proPremium": 55,
    "recommendedPlan": "Standard"
  }
}
```

---

## 📋 POLICY ENDPOINTS

### 8. Purchase Policy

**Endpoint:** `POST /api/policy/purchase`

**Description:** Buy insurance policy

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "planId": "standard",
  "premium": 42.50,
  "coverageAmount": 3000,
  "startDate": "2026-04-01T00:00:00Z",
  "endDate": "2026-04-08T00:00:00Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "✅ Policy purchased successfully",
  "data": {
    "policy": {
      "id": "pol_507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439011",
      "planId": "standard",
      "status": "active",
      "premium": 42.50,
      "coverageAmount": 3000,
      "startDate": "2026-04-01T00:00:00Z",
      "endDate": "2026-04-08T00:00:00Z",
      "createdAt": "2026-04-01T10:00:00.000Z"
    }
  }
}
```

---

### 9. Get User Policies (Protected)

**Endpoint:** `GET /api/policy/user/:userId`

**Description:** Get all policies for a user

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "✅ Policies retrieved",
  "data": {
    "policies": [
      {
        "id": "pol_507f1f77bcf86cd799439011",
        "planId": "standard",
        "status": "active",
        "premium": 42.50,
        "coverageAmount": 3000,
        "startDate": "2026-04-01T00:00:00Z",
        "endDate": "2026-04-08T00:00:00Z",
        "createdAt": "2026-04-01T10:00:00.000Z"
      }
    ]
  }
}
```

---

## 🏥 HEALTH & SYSTEM

### 10. Health Check

**Endpoint:** `GET /api/health`

**Description:** Check if server is running

**Response (200):**
```json
{
  "success": true,
  "message": "✅ Server is healthy",
  "data": {
    "version": "2.0.0",
    "timestamp": "2026-04-01T10:00:00.000Z",
    "environment": "development"
  }
}
```

---

## 🔑 AUTHENTICATION

### Using Token

All protected endpoints require token in header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Expiry

- **Expiry:** 30 days
- **Renewal:** Use `/api/auth/refresh-token` endpoint
- **On Expiry:** Automatic redirect to login on frontend

---

## 🚨 ERROR CODES

| Status | Message | Meaning |
|--------|---------|---------|
| 200 | Success | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Token missing/invalid |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal error |

---

## 📝 RATE LIMITS

- **General:** 100 requests per 15 minutes per IP
- **Authentication:** 5 attempts per 15 minutes per IP
- **After limit:** Must wait 15 minutes

---

## 🧪 TESTING WITH CURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "pincode": "560001",
    "workType": "Zomato",
    "income": 500
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

---

**Last Updated:** April 1, 2026  
**Version:** 2.0.0  
**API Status:** Production Ready ✅
