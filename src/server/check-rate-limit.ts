import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';

export async function checkRateLimit(key: string, preset: RateLimiterRedis) {

    try {
        await preset.consume(key);
        return { success: true };
    } catch (err) {

        if (err instanceof RateLimiterRes) {
            const retryAfter = Math.ceil(err.msBeforeNext / 1000);
            return {
                success: false,
                retryAfter
            };
        }
        return { success: false, retryAfter: 60 };
    }
}