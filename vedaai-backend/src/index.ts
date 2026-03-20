import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { connectDatabase, disconnectDatabase } from "./config/database";
import { getRedisClient } from "./config/redis";
import { setupWebSocket } from "./config/websocket";
import { closeQueues } from "./services/queueService";
import { startGenerationWorker } from "./workers/generationWorker";

import authRoutes from "./routes/auth";
import assignmentRoutes from "./routes/assignments";
import healthRoutes from "./routes/health";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();
const PORT = parseInt(process.env.PORT || "3001");

// ── Security & Middleware ──────────────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Global rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests. Please try again later." },
  })
);

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many auth attempts. Try again in 15 minutes." },
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/health", healthRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/assignments", assignmentRoutes);

// ── 404 & Error Handlers ──────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Bootstrap ─────────────────────────────────────────────────────────────────
async function bootstrap(): Promise<void> {
  try {
    // Connect MongoDB
    await connectDatabase();

    // Connect Redis (lazy, but ping to verify)
    try {
      const redis = getRedisClient();
      await redis.connect();
      await redis.ping();
      console.log("✅ Redis ping OK");
    } catch (err) {
      console.warn("⚠️  Redis connection failed. Continuing in Mock Cache mode...");
    }

    // Create HTTP server (shared between Express + WebSocket)
    const server = http.createServer(app);

    // Attach WebSocket server
    setupWebSocket(server);

    // Start BullMQ worker in-process (for single-dyno deployments)
    // In production, run `npm run worker` as a separate process/container
    try {
      await startGenerationWorker();
    } catch (err) {
      console.warn("⚠️  Generation worker failed to start. AI generation will use fallback logic.");
    }

    // Start listening
    server.listen(PORT, () => {
      console.log(`\n🚀 VedaAI Backend running on http://localhost:${PORT}`);
      console.log(`🔌 WebSocket available at  ws://localhost:${PORT}/ws`);
      console.log(`🏥 Health check at          http://localhost:${PORT}/api/health\n`);
    });

    // ── Graceful Shutdown ────────────────────────────────────────────────────
    const shutdown = async (signal: string) => {
      console.log(`\n⚠️  ${signal} received — shutting down gracefully...`);
      server.close(async () => {
        await Promise.all([disconnectDatabase(), closeQueues()]);
        const redis = getRedisClient();
        await redis.quit();
        console.log("✅ Graceful shutdown complete.");
        process.exit(0);
      });

      // Force exit after 10s
      setTimeout(() => {
        console.error("❌ Forced shutdown after timeout.");
        process.exit(1);
      }, 10_000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      shutdown("uncaughtException");
    });
    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled Rejection:", reason);
      shutdown("unhandledRejection");
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

bootstrap();
