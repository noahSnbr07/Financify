import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';

export async function checkRateLimit(key: string, preset: RateLimiterRedis) {

    try {
        await Promise.race([
            preset.consume(key),
            new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error("Rate limiter timed out")), 5000);
            }),
        ]);
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