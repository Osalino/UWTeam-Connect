# UWTeam Connect

A worship team management system for managing announcements, events, and team members.

---

## 📦 Requirements

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) (v18 or higher)
* [pnpm](https://pnpm.io/) (install with `npm install -g pnpm`)
* A PostgreSQL database (e.g. [Neon](https://neon.tech))

---

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd UWTeam-Connect
```

---

### 2. Install pnpm (if not installed)

```bash
npm install -g pnpm
```

---

### 3. Install project dependencies

```bash
pnpm install
```

---

### 4. Create environment file

```bash
cp .env.example .env
```

Then open `.env` and update:

```env
DATABASE_URL="your_database_url"
JWT_SECRET="your_secret_key"
PORT=3000
```

---

### 5. Generate Prisma Client

```bash
pnpm prisma generate
```

---

### 6. Run database migrations

```bash
pnpm prisma migrate dev
```

---

### 7. Start the development server

```bash
pnpm dev
```

---

## 🌐 Running the App

Once started, open your browser and go to:

```
http://localhost:8080
```

(or the port shown in your terminal)

---

## ⚠️ Notes

* Ensure your `.env` file contains a valid `DATABASE_URL`
* The `.env` file is not included in the repository for security reasons
* If you encounter errors, run:

```bash
pnpm install
pnpm prisma generate
```

---
