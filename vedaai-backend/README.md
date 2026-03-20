# VedaAI Backend

Node.js + Express + TypeScript backend for the VedaAI Assessment Creator.

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 + TypeScript |
| Framework | Express 4 |
| Database | MongoDB 7 (Mongoose ODM) |
| Cache / Job State | Redis 7 (ioredis) |
| Background Jobs | BullMQ |
| Real-time | WebSocket (ws) |
| AI | Anthropic Claude (claude-opus-4-5) |
| Auth | JWT (jsonwebtoken) |
| Security | helmet, cors, express-rate-limit |

---

## Architecture

```
HTTP Request
     │
     ▼
Express Router
     │
     ▼
Controller  ──► MongoDB (persist assignment)
     │
     ▼
BullMQ Queue  ──► WebSocket "JOB_QUEUED" event → Frontend
     │
     ▼
BullMQ Worker (in-process or separate)
     │
     ├──► Anthropic API (generate paper)
     │
     ├──► MongoDB (save GenerationResult)
     │
     └──► WebSocket "JOB_COMPLETED" event → Frontend
                         │
                         ▼
              Frontend fetches GET /api/assignments/:id/result
```

---

## Quick Start

### 1. Prerequisites

- Node.js 20+
- MongoDB running locally or Atlas URI
- Redis running locally
- Anthropic API key

### 2. Install

```bash
cd vedaai-backend
npm install
cp .env.example .env
# Edit .env — add ANTHROPIC_API_KEY and JWT_SECRET
```

### 3. Run with Docker (recommended)

```bash
# Start MongoDB + Redis + API all at once
ANTHROPIC_API_KEY=your_key docker-compose up

# API:            http://localhost:3001
# Health check:   http://localhost:3001/api/health
# Redis UI:       http://localhost:8081
```

### 4. Run locally (manual)

```bash
# Terminal 1 — API server (also runs worker in-process)
npm run dev

# Terminal 2 — Standalone worker (optional, for scaling)
npm run worker
```

---

## API Reference

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new teacher |
| POST | `/api/auth/login` | ❌ | Login, receive JWT |
| GET | `/api/auth/me` | ✅ | Get current teacher |
| POST | `/api/auth/logout` | ✅ | Logout (clears cache) |

### Assignments

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/assignments` | ✅ | List assignments (paginated) |
| POST | `/api/assignments` | ✅ | Create + auto-enqueue generation |
| GET | `/api/assignments/:id` | ✅ | Get single assignment |
| PATCH | `/api/assignments/:id` | ✅ | Update assignment metadata |
| DELETE | `/api/assignments/:id` | ✅ | Delete assignment + result |
| GET | `/api/assignments/:id/status` | ✅ | Poll job status |
| GET | `/api/assignments/:id/result` | ✅ | Fetch generated question paper |
| POST | `/api/assignments/:id/regenerate` | ✅ | Re-run AI generation |

### Health

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | MongoDB + Redis + Queue status |

---

## WebSocket Protocol

Connect to `ws://localhost:3001/ws`

### Client → Server messages

```jsonc
// 1. Authenticate immediately after connecting
{ "type": "AUTH", "token": "<JWT>" }

// 2. Subscribe to a job's real-time updates
{ "type": "SUBSCRIBE", "jobId": "<jobId>" }

// 3. Keep-alive
{ "type": "PING" }
```

### Server → Client events

```jsonc
{ "type": "AUTH_OK",       "userId": "...", "timestamp": "..." }
{ "type": "SUBSCRIBED",    "jobId": "...",  "timestamp": "..." }
{ "type": "JOB_QUEUED",    "jobId": "...", "message": "...", "progress": 0  }
{ "type": "JOB_STARTED",   "jobId": "...", "message": "...", "progress": 5  }
{ "type": "JOB_PROGRESS",  "jobId": "...", "message": "...", "progress": 30 }
{ "type": "JOB_COMPLETED", "jobId": "...", "data": { "resultId": "..." }, "progress": 100 }
{ "type": "JOB_FAILED",    "jobId": "...", "message": "Error reason",    "progress": 0  }
{ "type": "PONG",          "timestamp": "..." }
```

### Frontend integration example

```typescript
const ws = new WebSocket("ws://localhost:3001/ws");

ws.onopen = () => {
  // Step 1: Authenticate
  ws.send(JSON.stringify({ type: "AUTH", token: localStorage.getItem("token") }));
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === "AUTH_OK") {
    // Step 2: Subscribe to job after creating assignment
    ws.send(JSON.stringify({ type: "SUBSCRIBE", jobId: currentJobId }));
  }

  if (msg.type === "JOB_COMPLETED") {
    // Fetch the generated paper
    fetchResult(msg.data.resultId);
  }

  if (msg.type === "JOB_FAILED") {
    showError(msg.message);
  }
};
```

---

## POST /api/assignments — Request Body

```json
{
  "title": "Quiz on Electricity",
  "subject": "Science",
  "className": "9th",
  "dueDate": "2025-07-01",
  "questionTypes": [
    { "type": "Multiple Choice Questions", "numberOfQuestions": 4, "marksPerQuestion": 1 },
    { "type": "Short Questions",           "numberOfQuestions": 3, "marksPerQuestion": 2 },
    { "type": "Long Answer Questions",     "numberOfQuestions": 2, "marksPerQuestion": 5 }
  ],
  "additionalInstructions": "Focus on electroplating and electrolysis. 45-minute paper."
}
```

### Response

```json
{
  "success": true,
  "message": "Assignment created successfully",
  "data": {
    "assignment": { "id": "...", "title": "...", "status": "generating", "jobId": "..." },
    "jobId": "bullmq-job-id",
    "message": "Assignment created. Generation has started in the background."
  }
}
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | ❌ | `3001` | Server port |
| `MONGODB_URI` | ✅ | — | MongoDB connection string |
| `REDIS_HOST` | ❌ | `localhost` | Redis host |
| `REDIS_PORT` | ❌ | `6379` | Redis port |
| `REDIS_PASSWORD` | ❌ | — | Redis password (if any) |
| `ANTHROPIC_API_KEY` | ✅ | — | Anthropic API key |
| `JWT_SECRET` | ✅ | `dev-secret` | JWT signing secret |
| `JWT_EXPIRES_IN` | ❌ | `7d` | Token expiry |
| `FRONTEND_URL` | ❌ | `http://localhost:5173` | CORS origin |
| `CACHE_TTL` | ❌ | `3600` | Redis cache TTL in seconds |
| `GENERATION_QUEUE` | ❌ | `paper-generation` | BullMQ queue name |

---

## Project Structure

```
vedaai-backend/
├── src/
│   ├── config/
│   │   ├── database.ts       # MongoDB connection
│   │   ├── redis.ts          # Redis client + cache helpers
│   │   └── websocket.ts      # WebSocket server + event emitter
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── assignmentController.ts
│   ├── middleware/
│   │   ├── auth.ts           # JWT requireAuth middleware
│   │   └── errorHandler.ts   # Global error + 404 handlers
│   ├── models/
│   │   ├── Teacher.ts        # Teacher schema + bcrypt
│   │   ├── Assignment.ts     # Assignment schema
│   │   └── GenerationResult.ts  # Generated paper schema
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── assignments.ts
│   │   └── health.ts
│   ├── services/
│   │   ├── aiService.ts      # Anthropic API calls
│   │   └── queueService.ts   # BullMQ queue helpers
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── apiResponse.ts
│   ├── workers/
│   │   └── generationWorker.ts  # BullMQ worker process
│   └── index.ts              # App entry point
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── package.json
└── tsconfig.json
```
