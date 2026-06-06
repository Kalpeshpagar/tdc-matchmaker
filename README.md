# TDC Matchmaker Dashboard 

An internal matchmaking tool for TDC (The Date Crew) to manage clients, view profiles, and AI-powered match suggestions.

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 2. Seed the Database
```bash
cd backend
node seed.js
```
This creates:
- Matchmaker login: `matchmaker@tdc.com` / `tdc@123`
- 5 sample real customers
- 100 dummy profiles for the match pool

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: https://tdc-matchmaker-frontend.onrender.com 
Backend runs on: https://tdc-matchmaker-backend.onrender.com

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + CSS Modules |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| AI | OpenAI GPT-3.5 (with fallback) |
| Hosting | Render|

## 📁 Project Structure

```
tdc-matchmaker/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/          # Business logic
│   ├── middleware/            # JWT auth
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routes
│   ├── data/dummyProfiles.js # Profile generator
│   ├── seed.js               # DB seeder
│   └── server.js             # Entry point
└── frontend/
    └── src/
        ├── context/AuthContext.jsx
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── DashboardPage.jsx
        │   └── CustomerDetailPage.jsx
        └── App.jsx
```

## AI Integration

- **Match Scoring**: Rule-based algorithm scores each match 0–100 with explanations
- **AI Intro Emails**: OpenAI GPT-3.5 generates personalized intro emails per match
- **Fallback**: If no OpenAI key, a template-based intro is generated automatically

## Matching Logic

**For Male Customers:** Matches women who are younger, earn less, shorter, with compatible views on children, religion, and city.

**For Female Customers:** Matches based on income, family values alignment, relocation compatibility, children preferences, and religion.
