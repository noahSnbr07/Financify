import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT!) || 6379,
});

const LIMIT_PRESETS = {
    STANDARD: new RateLimiterRedis({
        storeClient: redis,
        keyPrefix: 'rate-limit:',
        points: 100,
        duration: 60,
        blockDuration: 60,
    }), STRICT: new RateLimiterRedis({
        storeClient: redis,
        keyPrefix: 'rate-limit:',
        points: 25,
        duration: 60,
        blockDuration: 60,
    }), AUTH: new RateLimiterRedis({
        storeClient: redis,
        keyPrefix: 'rate-limit:',
        points: 5,
        duration: 60,
        blockDuration: 60 * 15,
    }), AI: new RateLimiterRedis({
        storeClient: redis,
        keyPrefix: 'rate-limit:',
        points: 10,
        duration: 60,
        blockDuration: 60,
    }), RELAXED: new RateLimiterRedis({
        storeClient: redis,
        keyPrefix: 'rate-limit:',
        points: 150,
        duration: 60,
        blockDuration: 60,
    }),
}
export default LIMIT_PRESETS;