import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage, Server } from "http";
import { verifyToken } from "../utils/jwt";

interface WSClient {
  ws: WebSocket;
  userId: string;
  isAlive: boolean;
}

// Map: jobId -> Set of WebSocket clients interested in that job
const jobSubscribers = new Map<string, Set<string>>();
// Map: userId -> WSClient
const clients = new Map<string, WSClient>();

export type WSEventType =
  | "JOB_QUEUED"
  | "JOB_STARTED"
  | "JOB_PROGRESS"
  | "JOB_COMPLETED"
  | "JOB_FAILED"
  | "PING"
  | "PONG";

export interface WSMessage {
  type: WSEventType;
  jobId?: string;
  data?: unknown;
  message?: string;
  progress?: number;
  timestamp: string;
}

export function setupWebSocket(server: Server): WebSocketServer {
  const wss = new WebSocketServer({ server, path: "/ws" });

  // Heartbeat — drop stale connections every 30s
  const interval = setInterval(() => {
    clients.forEach((client, userId) => {
      if (!client.isAlive) {
        client.ws.terminate();
        clients.delete(userId);
        return;
      }
      client.isAlive = false;
      client.ws.ping();
    });
  }, 30_000);

  wss.on("close", () => clearInterval(interval));

  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    console.log("🔌 WebSocket connection attempt");

    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        // AUTH handshake
        if (msg.type === "AUTH") {
          const payload = verifyToken(msg.token);
          if (!payload) {
            ws.send(JSON.stringify({ type: "AUTH_ERROR", message: "Invalid token" }));
            ws.close();
            return;
          }
          const userId = payload.userId;
          clients.set(userId, { ws, userId, isAlive: true });
          ws.send(JSON.stringify({ type: "AUTH_OK", userId, timestamp: new Date().toISOString() }));
          console.log(`✅ WS authenticated: user ${userId}`);
          return;
        }

        // SUBSCRIBE to job updates
        if (msg.type === "SUBSCRIBE" && msg.jobId) {
          const userId = getUserIdFromWs(ws);
          if (userId) {
            if (!jobSubscribers.has(msg.jobId)) {
              jobSubscribers.set(msg.jobId, new Set());
            }
            jobSubscribers.get(msg.jobId)!.add(userId);
            ws.send(JSON.stringify({ type: "SUBSCRIBED", jobId: msg.jobId, timestamp: new Date().toISOString() }));
          }
          return;
        }

        // PING
        if (msg.type === "PING") {
          const userId = getUserIdFromWs(ws);
          if (userId) {
            const client = clients.get(userId);
            if (client) client.isAlive = true;
          }
          ws.send(JSON.stringify({ type: "PONG", timestamp: new Date().toISOString() }));
          return;
        }
      } catch (err) {
        console.error("WS message parse error:", err);
      }
    });

    ws.on("pong", () => {
      const userId = getUserIdFromWs(ws);
      if (userId) {
        const client = clients.get(userId);
        if (client) client.isAlive = true;
      }
    });

    ws.on("close", () => {
      const userId = getUserIdFromWs(ws);
      if (userId) {
        clients.delete(userId);
        console.log(`🔌 WS disconnected: user ${userId}`);
      }
    });

    ws.on("error", (err) => console.error("WS error:", err));
  });

  console.log("✅ WebSocket server initialized at /ws");
  return wss;
}

function getUserIdFromWs(ws: WebSocket): string | null {
  for (const [userId, client] of clients.entries()) {
    if (client.ws === ws) return userId;
  }
  return null;
}

// Emit an event to all subscribers of a given job
export function emitJobEvent(jobId: string, event: Omit<WSMessage, "timestamp">): void {
  const msg: WSMessage = { ...event, timestamp: new Date().toISOString() };
  const serialized = JSON.stringify(msg);

  const subscribers = jobSubscribers.get(jobId);
  if (!subscribers) return;

  subscribers.forEach((userId) => {
    const client = clients.get(userId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(serialized);
    }
  });

  // Cleanup completed/failed jobs
  if (event.type === "JOB_COMPLETED" || event.type === "JOB_FAILED") {
    jobSubscribers.delete(jobId);
  }
}

// Emit to a specific user directly
export function emitToUser(userId: string, event: Omit<WSMessage, "timestamp">): void {
  const client = clients.get(userId);
  if (client && client.ws.readyState === WebSocket.OPEN) {
    client.ws.send(JSON.stringify({ ...event, timestamp: new Date().toISOString() }));
  }
}

export function getConnectedClientCount(): number {
  return clients.size;
}
