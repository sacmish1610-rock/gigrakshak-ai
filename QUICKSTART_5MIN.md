# 🚀 QUICK START GUIDE - 5 MINUTES

Get GigRAKSHAK AI running in under 5 minutes!

---

## 📋 PREREQUISITES

- Node.js v16+ installed
- npm installed  
- MongoDB Atlas account (free at https://www.mongodb.com/cloud/atlas)

---

## ⚡ STEP 1: Clone & Setup (1 min)

```powershell
# Navigate to project directory
cd gigrakshak-ai
```

---

## ⚡ STEP 2: Get MongoDB Connection String (2 min)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account or login
3. Create new project → Create cluster (FREE tier)
4. Go to "Security" → "Database Access" → Create user
5. Go to "Security" → "Network Access" → Add IP (0.0.0.0/0)
6. Click "Connect" → Copy connection string
7. Replace `<password>` with your actual password

**Example:**
```
mongodb+srv://username:password@cluster.mongodb.net/gigrakshak?retryWrites=true&w=majority
```

---

## ⚡ STEP 3: Configure Backend (1 min)

Open `backend/.env` and update:

```env
JWT_SECRET=my_super_secret_key_12345
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gigrakshak?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## ⚡ STEP 4: Install & Run Backend (30 sec)

```powershell
cd backend
npm install
npm run dev
```

✅ You should see:
```
✅ MongoDB Connected Successfully
🚀 GigRakshak AI Backend v2.0 running on port 5000
```

---

## ⚡ STEP 5: Install & Run Frontend (30 sec)

**Open NEW terminal**

```powershell
cd frontend
npm install
npm run dev
```

✅ Opens at: **http://localhost:5173**

---

## 🎉 THAT'S IT!

Now you can:
1. Click **"Get Started"** on landing page
2. Click **"Sign Up"**
3. Enter any email and password
4. Enter pincode: **560001** (auto-fills Bangalore)
5. Select platform & income
6. See risk calculation
7. Purchase a policy plan
8. View dashboard

---

## 🧪 TESTING

### Test Registration

Go to http://localhost:5173 and sign up with:
- **Email:** test@example.com
- **Password:** password123
- **Pincode:** 560001
- **Daily Income:** 500

### Test Login

Use the same credentials to login after registration.

### Test API Directly

```powershell
# Check if backend is running
curl http://localhost:5000/api/health

# Should return: {"success":true,"message":"✅ Server is healthy",...}
```

---

## ❌ TROUBLESHOOTING

### "Cannot connect to MongoDB"
- Check MONGO_URI in `backend/.env`
- Verify MongoDB Atlas IP whitelist includes your IP
- Verify username/password are correct

### "Port 5000 already in use"
```powershell
# Windows: Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Frontend can't reach backend"
- Verify backend is running on port 5000
- Check `frontend/.env.local` has `VITE_API_URL=http://localhost:5000/api`
- Restart both servers

### "Port 5173 already in use"
```powershell
# Kill process using port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## 📚 FULL DOCUMENTATION

For deployment and detailed setup, see [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md)

For all fixes applied, see [FIXES_SUMMARY.md](FIXES_SUMMARY.md)

---

**That's it! Happy coding! 🎉**
