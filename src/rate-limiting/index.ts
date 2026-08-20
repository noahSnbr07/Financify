import type { RateLimitConfig, RateLimitResult } from "./core";
import { rateLimiter, getClientIp, RateLimitPresets } from "./core";

import { checkRateLimit, identifiers, withRateLimit } from "./proxy-limiter";

export {
    RateLimitConfig,
    RateLimitPresets,
    RateLimitResult,
    getClientIp,
    rateLimiter,

    checkRateLimit,
    identifiers,
    withRateLimit,
}