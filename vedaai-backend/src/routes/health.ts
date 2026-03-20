import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { getRedisClient } from "../config/redis";
import { getConnectedClientCount } from "../config/websocket";
import { getGenerationQueue } from "../services/queueService";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  let redisStatus = "disconnected";
  try {
    const redis = getRedisClient();
    await redis.ping();
    redisStatus = "connected";
  } catch {
    redisStatus = "disconnected";
  }

  let queueStats = { waiting: 0, active: 0, completed: 0, failed: 0 };
  try {
    const queue = getGenerationQueue();
    const [waiting, active, completed, failed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
    ]);
    queueStats = { waiting, active, completed, failed };
  } catch {
    // Queue not available
  }

  const healthy = mongoStatus === "connected" && redisStatus === "connected";

  res.status(healthy ? 200 : 503).json({
    status: healthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    services: {
      mongodb: mongoStatus,
      redis: redisStatus,
      websocket: {
        status: "running",
        connectedClients: getConnectedClientCount(),
      },
      queue: {
        status: redisStatus === "connected" ? "running" : "unavailable",
        ...queueStats,
      },
    },
    version: process.env.npm_package_version || "1.0.0",
  });
});

export default router;
