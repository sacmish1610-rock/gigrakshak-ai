# 🚀 GigRAKSHAK AI - Production Setup Guide

This guide will help you set up GigRAKSHAK AI as a production-ready application.

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Backend Installation](#backend-installation)
4. [Frontend Installation](#frontend-installation)
5. [Database Configuration](#database-configuration)
6. [Running the Application](#running-the-application)
7. [API Endpoints](#api-endpoints)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## 📦 PREREQUISITES

Before starting, ensure you have:

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** v7+ (comes with Node.js)
- **MongoDB Atlas** account ([Create free account](https://www.mongodb.com/cloud/atlas))
- **Git** installed ([Download](https://git-scm.com/))
- A modern code editor (VS Code recommended)

Verify installations:
```powershell
node --version
npm --version
git --version
```

---

## 🔧 ENVIRONMENT SETUP

### Backend Environment Variables

1. Open `backend/.env` and configure:

```env
# 🔒 SECURITY
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# 📦 DATABASE
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gigrakshak?retryWrites=true&w=majority

# 🚀 SERVER
PORT=5000
NODE_ENV=development

# 🌐 FRONTEND
FRONTEND_URL=http://localhost:5173

# 📡 EXTERNAL APIs
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

**How to generate JWT_SECRET:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**How to get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project and cluster
3. Create a database user with username/password
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/gigrakshak?retryWrites=true&w=majority`
5. Replace `username` and `password` with your credentials

### Frontend Environment Variables

1. Create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
VITE_APP_NAME=GigRakshak AI
```

---

## 🔙 BACKEND INSTALLATION

### Step 1: Install Dependencies

```powershell
cd backend
npm install
```

**New packages added:**
- `express-rate-limit` - Rate limiting for security
- `express-validator` - Input validation

### Step 2: Verify MongoDB Connection

```powershell
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
```

If you see connection errors:
- Check your `MONGO_URI` in `.env`
- Verify MongoDB Atlas IP whitelist includes your IP
- Check username/password are correct

### Step 3: Health Check

Test the API:
```powershell
curl http://localhost:5000/api/health
```

Response should be:
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

## 🎨 FRONTEND INSTALLATION

### Step 1: Install Dependencies

```powershell
cd frontend
npm install
```

### Step 2: Run Development Server

```powershell
npm run dev
```

Frontend should be available at:
```
http://localhost:5173
```

---

## 🗄️ DATABASE CONFIGURATION

### Creating MongoDB Database

1. **Login to MongoDB Atlas:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign in with your account

2. **Create a Cluster:**
   - Click "Clusters" → New Project
   - Select cluster type (FREE tier recommended for development)
   - Choose AWS region (select closest to your location)
   - Create cluster (takes 5-10 minutes)

3. **Create Database User:**
   - Go to "Security" → "Database Access"
   - Click "Add New Database User"
   - Set Username/Password
   - Set permissions to "Manage all databases"

4. **Whitelist IP:**
   - Go to "Security" → "Network Access"
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0) for development

5. **Get Connection String:**
   - Go back to Clusters
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password

---

## ▶️ RUNNING THE APPLICATION

### Option 1: Separate Terminals (Recommended for Development)

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Option 2: Single Terminal (Using npm-run-all)

```powershell
# From root directory
npm install -g npm-run-all

# Then run:
npm-run-all --parallel "npm:dev:backend" "npm:dev:frontend"
```

---

## 🔗 API ENDPOINTS

### Authentication Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| POST | `/api/auth/refresh-token` | Refresh JWT token | ✅ |

### Example Requests

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ramesh@example.com",
    "password": "password123"
  }'
```

**Get Profile (Protected):**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🚀 DEPLOYMENT

### Backend Deployment (Heroku Example)

1. **Install Heroku CLI:**
   ```powershell
   # Via npm
   npm install -g heroku
   ```

2. **Login to Heroku:**
   ```powershell
   heroku login
   ```

3. **Create Heroku App:**
   ```powershell
   cd backend
   heroku create gigrakshak-api
   ```

4. **Set Environment Variables:**
   ```powershell
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set MONGO_URI=your_mongo_uri
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-frontend.com
   ```

5. **Deploy:**
   ```powershell
   git push heroku main
   ```

6. **View Logs:**
   ```powershell
   heroku logs --tail
   ```

### Frontend Deployment (Vercel Example)

1. **Install Vercel CLI:**
   ```powershell
   npm install -g vercel
   ```

2. **Deploy:**
   ```powershell
   cd frontend
   vercel
   ```

3. **Update API URL:**
   - Set `VITE_API_URL` to your Heroku backend URL in production environment

---

## 🆘 TROUBLESHOOTING

### "MongoDB Connection Error"
**Cause:** Wrong connection string or IP not whitelisted
**Fix:**
- Check `MONGO_URI` in `.env`
- Add your IP to MongoDB Atlas whitelist
- Verify username/password

### "Port 5000 already in use"
**Cause:** Another application using port 5000
**Fix:**
```powershell
# Windows: Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change PORT in .env to 5001
```

### "Frontend can't connect to backend"
**Cause:** VITE_API_URL is wrong or backend not running
**Fix:**
- Verify backend is running on port 5000
- Check `VITE_API_URL` in `frontend/.env.local`
- Clear browser cache and restart

### "JWT Token Expired"
**Cause:** Token has expired (default 30 days)
**Fix:**
- Use `/api/auth/refresh-token` endpoint to get new token
- Or login again

### "CORS Error"
**Cause:** Frontend URL not in backend CORS whitelist
**Fix:**
- Check `FRONTEND_URL` in backend `.env`
- Make sure it matches exactly (including http://)
- Restart backend server

---

## 📚 ADDITIONAL RESOURCES

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [JWT vs Sessions](https://tools.ietf.org/html/rfc7519)

---

## ✅ NEXT STEPS

After successful setup:

1. ✅ Register a new user via frontend signup
2. ✅ Verify user is saved in MongoDB
3. ✅ Login with registered credentials
4. ✅ Navigate through risk calculator
5. ✅ Purchase a policy plan
6. ✅ View dashboard with policy details

---

**Last Updated:** April 1, 2026  
**Version:** 2.0.0  
**Maintained By:** GigRAKSHAK AI Team
