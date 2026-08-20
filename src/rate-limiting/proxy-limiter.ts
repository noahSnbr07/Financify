import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter, getClientIp, RateLimitConfig } from './index';

export function withRateLimit<T extends (...args: unknown[]) => Promise<NextResponse>>(
    handler: T,
    config: RateLimitConfig,
    getIdentifier?: (request: NextRequest) => string
): T {
    return (async (request: NextRequest, ...args: unknown[]) => {
        const identifier = getIdentifier?.(request) || getClientIp(request);
        const result = rateLimiter.check(identifier, config.limit, config.window);

        const response = await handler(request, ...args);

        // Add rate limit headers
        response.headers.set('X-RateLimit-Limit', String(result.limit));
        response.headers.set('X-RateLimit-Current', String(result.current));
        response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetTime / 1000)));

        if (!result.success) {
            return new NextResponse(
                JSON.stringify({
                    error: 'Too many requests',
                    retryAfter: result.retryAfter,
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RateLimit-Limit': String(result.limit),
                        'X-RateLimit-Current': String(result.current),
                        'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
                        'Retry-After': String(result.retryAfter),
                    },
                }
            );
        }

        return response;
    }) as T;
}

export async function checkRateLimit(
    request: NextRequest,
    config: RateLimitConfig,
    getIdentifier?: (request: NextRequest) => string
) {
    const identifier = getIdentifier?.(request) || getClientIp(request);
    const result = rateLimiter.check(identifier, config.limit, config.window);

    if (!result.success) {
        const response = new NextResponse(
            JSON.stringify({
                error: 'Too many requests',
                retryAfter: result.retryAfter,
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': String(result.retryAfter),
                },
            }
        );

        return {
            success: false,
            response,
            result,
        };
    }

    return {
        success: true,
        response: null,
        result,
        headers: {
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Current': String(result.current),
            'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
        },
    };
}

export const identifiers = {
    // Rate limit by IP address (default)
    ip: (request: NextRequest) => getClientIp(request),

    // Rate limit by user ID from JWT or session
    userId: (getUserId: (request: NextRequest) => string | null) => (request: NextRequest) => {
        const userId = getUserId(request);
        return userId || getClientIp(request);
    },

    // Rate limit by API key
    apiKey: (request: NextRequest) => {
        const key = request.headers.get('x-api-key') || request.headers.get('authorization');
        return key || getClientIp(request);
    },

    // Combination: User ID if authenticated, IP if not
    hybrid:
        (getUserId: (request: NextRequest) => string | null) =>
            (request: NextRequest) => {
                const userId = getUserId(request);
                return userId ? `user:${userId}` : `ip:${getClientIp(request)}`;
            },
};