import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";

const isBuildPhase = () => process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV === "test";

const getRedisClient = () => {
    if (isBuildPhase()) return null;

    const host = process.env.REDIS_HOST || "redis";
    const port = Number(process.env.REDIS_PORT || 6379);

    return new Redis({
        host,
        port,
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        enableReadyCheck: true,
    });
};

const createLimiter = (points: number, duration: number, blockDuration: number) => {
    const client = getRedisClient();
    if (!client) return null;

    return new RateLimiterRedis({
        storeClient: client,
        keyPrefix: 'rate-limit:',
        points,
        duration,
        blockDuration,
    });
};

export const redis = getRedisClient();

const LIMIT_PRESETS = {
    get STANDARD() {
        return createLimiter(100, 60, 60);
    },
    get STRICT() {
        return createLimiter(25, 60, 60);
    },
    get AUTH() {
        return createLimiter(5, 60, 60 * 15);
    },
    get AI() {
        return createLimiter(10, 60, 60);
    },
    get RELAXED() {
        return createLimiter(150, 60, 60);
    },
};

export default LIMIT_PRESETS;