export type RateLimitConfig = {
    limit: number;
    window: number;
};

export type RateLimitResult = {
    success: boolean;
    limit: number;
    current: number;
    resetTime: number;
    retryAfter?: number;
};

class RateLimiter {
    private store: Map<string, { count: number; resetTime: number }> = new Map();
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor() {
        // Auto-cleanup stale entries every 60 seconds
        this.startCleanup();
    }

    private startCleanup() {
        this.cleanupInterval = setInterval(() => {
            const now = Date.now();
            for (const [key, value] of this.store.entries()) {
                if (value.resetTime < now) {
                    this.store.delete(key);
                }
            }
        }, 60000);
    }

    check(
        identifier: string,
        limit: number,
        windowMs: number
    ): RateLimitResult {
        const now = Date.now();
        const entry = this.store.get(identifier);

        // First request or window expired
        if (!entry || entry.resetTime < now) {
            this.store.set(identifier, {
                count: 1,
                resetTime: now + windowMs,
            });
            return {
                success: true,
                limit,
                current: 1,
                resetTime: now + windowMs,
            };
        }

        // Increment counter
        entry.count++;

        const success = entry.count <= limit;
        const result: RateLimitResult = {
            success,
            limit,
            current: entry.count,
            resetTime: entry.resetTime,
        };

        // Add retry-after header info if rate limited
        if (!success) {
            result.retryAfter = Math.ceil((entry.resetTime - now) / 1000);
        }

        return result;
    }

    reset(identifier: string): void {
        this.store.delete(identifier);
    }

    resetAll(): void {
        this.store.clear();
    }

    destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.store.clear();
    }

    getStats(identifier: string) {
        return this.store.get(identifier);
    }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Preset configurations
export const RateLimitPresets = {
    // Strict: 5 requests per minute
    strict: { limit: 5, window: 60 * 1000 },

    // Standard: 30 requests per minute
    standard: { limit: 30, window: 60 * 1000 },

    // Relaxed: 100 requests per minute
    relaxed: { limit: 100, window: 60 * 1000 },

    // API: 60 requests per minute
    api: { limit: 60, window: 60 * 1000 },

    // Auth: 5 attempts per 15 minutes
    auth: { limit: 5, window: 15 * 60 * 1000 },

    // Search: 20 requests per 10 seconds
    search: { limit: 20, window: 10 * 1000 },
} as const;

/**
 * Extract client IP from request
 * Works with common proxies (Cloudflare, Vercel, nginx, etc.)
 */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfIp = request.headers.get('cf-connecting-ip');

    return (forwarded?.split(',')[0].trim() ||
        realIp ||
        cfIp ||
        'unknown') as string;
}