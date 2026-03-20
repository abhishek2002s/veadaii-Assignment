# VedaAI - AI-Powered Teacher's Assistant ✦

VedaAI is a comprehensive full-stack platform designed to help teachers generate, manage, and assign question papers and assessments using advanced AI.

## 🚀 Key Features

- **AI Assessment Generation**: Create structured question papers (MCQs, Short/Long Answers) in seconds.
- **Mobile-First Design**: Premium, responsive UI for teachers on the go.
- **Assignment Management**: Track and view created assessments easily.
- **Teacher Toolkit**: Scalable platform for expanding AI-powered classroom tools.

## 🛠 Tech Stack

- **Frontend**: Next.js, React, Tailwind (custom inline-styles), Zustand.
- **Backend**: Node.js, Express, TypeScript, MongoDB Atlas.
- **AI Engine**: Anthropic Claude / Gemini (via AI service).
- **Queues**: BullMQ & Redis for background AI generation.

---

## 💻 Local Development

### 1. Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- Redis server running locally

### 2. Backend Setup

```bash
cd vedaai-backend
npm install
# Configure your .env (see vedaai-backend/.env.example)
npm run dev
```

### 3. Frontend Setup

```bash
cd vedaai-frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## ☁️ Deployment Guide

### **Backend (Render / Railway)**

1. **Root Directory**: `vedaai-backend`
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   - `MONGODB_URI`: Your MongoDB Atlas string.
   - `JWT_SECRET`: A secure random string.
   - `FRONTEND_URL`: Your deployed Vercel URL (e.g., `https://vedaai1-assignment.vercel.app`).
   - `REDIS_HOST`: Your Redis host.

### **Frontend (Vercel)**

1. **Root Directory**: `vedaai-frontend`
2. **Framework**: Next.js
3. **Environment Variable**:
   - `NEXT_PUBLIC_API_URL`: Your deployed Backend URL with `/api` suffix (e.g., `https://vedaai-backend.onrender.com/api`).

---

## 📄 License

MIT
