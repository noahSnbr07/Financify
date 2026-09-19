import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';

export async function checkRateLimit(key: string, preset: RateLimiterRedis) {

    try {
        await preset.consume(key);
        return { success: true };
    } catch (error) {
        if (error instanceof RateLimiterRes) {
            const retryAfter = Math.ceil(error.msBeforeNext / 1000);
            return {
                success: false,
                retryAfter
            };
        }

        // Redis availability should not take the application offline.
        console.error("Rate limiter unavailable:", error);
        return { success: true };
    }
}