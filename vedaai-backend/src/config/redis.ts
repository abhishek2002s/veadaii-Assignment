import IORedis from "ioredis";

let redisClient: IORedis | null = null;
let isMockMode = false;

export function getRedisClient(): IORedis {
  if (!redisClient) {
    const config = {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
      commandTimeout: 1000,
    };

    redisClient = new IORedis(config);

    redisClient.on("connect", () => {
      console.log("✅ Redis connected");
      isMockMode = false;
    });

    redisClient.on("error", (err: any) => {
      if (err.code === "ECONNREFUSED" || err.code === "ETIMEDOUT") {
        if (!isMockMode) {
          console.warn("⚠️  Redis missing or unreachable. Entering Mock Cache Mode.");
          isMockMode = true;
        }
      } else {
        console.error("❌ Redis error:", err.message);
      }
    });

    redisClient.on("reconnecting", () => {
      // Quiet reconnecting logs in mock mode
      if (!isMockMode) console.warn("⚠️  Redis reconnecting...");
    });
  }
  return redisClient;
}

export const bullmqConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null as null,
  enableReadyCheck: false,
};

// Cache helpers with mock support
const memoryCache = new Map<string, string>();

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    if (isMockMode) {
      const val = memoryCache.get(key);
      return val ? (JSON.parse(val) as T) : null;
    }
    const redis = getRedisClient();
    const val = await redis.get(key);
    return val ? (JSON.parse(val) as T) : null;
  } catch (err) {
    isMockMode = true;
    const val = memoryCache.get(key);
    return val ? (JSON.parse(val) as T) : null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttl: number = parseInt(process.env.CACHE_TTL || "3600")
): Promise<void> {
  try {
    const json = JSON.stringify(value);
    if (isMockMode) {
      memoryCache.set(key, json);
      return;
    }
    const redis = getRedisClient();
    await redis.set(key, json, "EX", ttl);
  } catch (err) {
    isMockMode = true;
    memoryCache.set(key, JSON.stringify(value));
  }
}

export async function cacheDel(key: string): Promise<void> {
  try {
    if (isMockMode) {
      memoryCache.delete(key);
      return;
    }
    const redis = getRedisClient();
    await redis.del(key);
  } catch (err) {
    isMockMode = true;
    memoryCache.delete(key);
  }
}

export function isRedisAvailable(): boolean {
  return !isMockMode;
}
