# Login System - Complete with Comments

## What's Been Done

### 1. **Full Authentication System with Comments**
All backend authentication code has been extensively commented:

- **server/server.ts** (309 lines) - Every route explained step-by-step
- **server/middleware/auth.ts** (82 lines) - JWT middleware fully documented
- **server/utils/validation.ts** (101 lines) - Input validation and XSS prevention explained
- **server/data/db.ts** (24 lines) - Database connection documented
- **client/pages/Login.tsx** - Frontend login with validation comments

### 2. **Security Features Implemented**
-**JWT Authentication** - 7-day tokens
-**bcrypt Password Hashing** - 10 salt rounds
-**Protected Routes** - All API endpoints except login/signup require token
-**Input Sanitization** - XSS prevention on all text inputs
-**Zod Validation** - Schema validation for all requests
-**Better Error Messages** - Client-side validation before API calls

### 3. **Database Setup**
- Prisma schema configured with User, Announcement, Event models
- All relationships defined
- Indexes added for performance

---

## Current Issue: Prisma 7.x Configuration

**Problem:** Prisma 7.x has changed how it handles SQLite databases. It now requires either:
1. A driver adapter (better-sqlite3) - which needs native compilation
2. An accelerateUrl for Prisma Accelerate service

**Status:** The better-sqlite3 adapter requires building native bindings which is failing on your system.

---

## Solution Options

### **Option 1: Use Prisma 6.x (RECOMMENDED - Simplest)**

Downgrade to Prisma 6 which works without adapters:

```bash
pnpm remove prisma @prisma/client @prisma/adapter-better-sqlite3
pnpm add -D prisma@6.22.1
pnpm add @prisma/client@6.22.1
npx prisma generate
```

Then start the servers normally.

### **Option 2: Use In-Memory Storage (For Testing)**

I can create a simple in-memory user/announcement storage that doesn't require Prisma at all. This would work immediately but data resets on server restart.

### **Option 3: Fix better-sqlite3 Build**

Install Visual Studio Build Tools for Windows and rebuild:
```bash
pnpm rebuild better-sqlite3
```

---

## Code Comments Summary

### **Backend Flow (server/server.ts)**

**Signup Route (`/api/auth/signup`):**
1. Validate input with Zod schema
2. Sanitize username/email to prevent XSS
3. Check if username exists in database
4. Hash password with bcrypt (10 rounds)
5. Create user in database
6. Generate JWT token (expires in 7 days)
7. Return user data + token

**Login Route (`/api/auth/login`):**
1. Validate credentials with Zod
2. Sanitize username input
3. Find user in database
4. Compare password hash with bcrypt
5. Generate new JWT token
6. Return user data + token

**Protected Routes:**
- `authenticateToken` middleware checks JWT before allowing access
- Extracts token from `Authorization: Bearer <token>` header
- Verifies token signature and expiration
- Attaches user data to request object

### **Frontend Flow (client/pages/Login.tsx)**

1. User enters username (3+ chars) and password (6+ chars)
2. Client-side validation before API call
3. Send POST request to `/api/auth/login` or `/api/auth/signup`
4. Store returned token in `localStorage`
5. Store user data in `localStorage`
6. Redirect to home page
7. All subsequent API calls include token in headers

---

## How Data Flows

```
User Signup/Login
    ↓
Frontend validates (6+ char password, 3+ char username)
    ↓
POST to /api/auth/signup or /api/auth/login
    ↓
Backend validates with Zod schemas
    ↓
Backend sanitizes inputs (XSS prevention)
    ↓
[Signup: Hash password with bcrypt]
[Login: Compare password hash]
    ↓
Generate JWT token (contains user id, username, role)
    ↓
Return {user: {...}, token: "..."}
    ↓
Frontend stores in localStorage
    ↓
All API calls send: Authorization: Bearer <token>
    ↓
authenticateToken middleware verifies token
    ↓
Route handler accesses req.user (decoded token data)
    ↓
Database operations (announcements, team members, etc.)
```

---

## What You Need to Do Next

**Choose ONE solution above** and I'll help implement it immediately.

**My Recommendation:** Use Option 1 (Prisma 6) - it's the simplest and will work right away.

Let me know which option you prefer and I'll get your login working in minutes!

---

## Key Learnings

1. **Never store plain passwords** - Always use bcrypt hashing
2. **JWT tokens contain user data** - No need to query database on every request
3. **XSS prevention is critical** - Sanitize all user inputs
4. **Validation happens twice** - Client-side (UX) and server-side (security)
5. **Protected routes need middleware** - Check token before allowing access
6. **localStorage persists tokens** - Users stay logged in across refreshes

---

All code is fully commented and ready to use once we resolve the Prisma issue!
