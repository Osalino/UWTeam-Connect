# 🚀 How to Start Your Application

## Step-by-Step Instructions

### 1️⃣ Start Backend Server (Terminal 1)
```bash
cd server
npx tsx index.ts
```
**Wait for:** `Server running on http://localhost:3000`

---

### 2️⃣ Start Frontend (Terminal 2)
```bash
npm run dev
```
**Wait for:** `Local: http://localhost:8081/`

---

### 3️⃣ Open Browser
Go to: **http://localhost:8081**

---

## ✅ Fixed Issues:
- ✅ Route matching (sidebar links now match routes)
- ✅ Token validation on protected pages
- ✅ Better error logging in console
- ✅ Logout clears both user and token

## 🔧 Troubleshooting

### Blank Page Issue (FIXED):
**Problem:** Announcements and Team Members pages were blank
**Cause:**
1. Sidebar links had wrong case (`/TeamMembers` vs `/teammembers`)
2. Missing token checks

**Solution:**
- Fixed all sidebar routes to lowercase
- Added token validation in API calls
- Added better error messages in console

### If Pages Are Still Blank:
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Make sure you're logged in (have token)
4. Verify backend is running on port 3000

---

## 📝 Test the Fix:

1. **Login/Signup** at http://localhost:8081/login
2. After login, you'll see the home page with announcements
3. Click **"Team Members"** in sidebar → Should show team page
4. Click **"Announcements"** in sidebar → Should show announcements page
5. Both pages should now work properly!

---

## 🎯 What's Working Now:
✅ Login/Signup with JWT
✅ Home page shows recent announcements
✅ Announcements page (create & view)
✅ Team Members page (view all users)
✅ Protected routes
✅ Logout functionality

Happy coding! 🎉
