import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@/src/server'
import { getClientIp, rateLimiter, RateLimitPresets } from './rate-limiting';

export default async function proxy(request: NextRequest): Promise<NextResponse> {

    //skip for statics
    if (
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/static') ||
        request.nextUrl.pathname.match(/\.(js|css|png|jpg|gif|ico|svg?)$/)
    ) {
        return NextResponse.next();
    }

    const token = request.cookies.get('financify-token')?.value;
    if (!token) return NextResponse.redirect(new URL('/authentication', request.url));

    const auth = await getAuth(token);
    if (!auth) return NextResponse.redirect(new URL('/authentication', request.url));

    const clientIp = getClientIp(request);
    const pathname = request.nextUrl.pathname;

    let config: { limit: number; window: number; } = RateLimitPresets.standard;

    if (pathname.startsWith('/api/authentication/login')) {
        config = RateLimitPresets.auth;
    }

    else config = RateLimitPresets.standard

    const result = rateLimiter.check(clientIp, config.limit, config.window);
    const response = NextResponse.next();

    response.headers.set('X-RateLimit-Limit', String(result.limit));
    response.headers.set('X-RateLimit-Current', String(result.current));
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetTime / 1000)));

    if (!result.success) {
        return new NextResponse('Too Many Requests', {
            status: 429,
            headers: {
                'X-RateLimit-Limit': String(result.limit),
                'X-RateLimit-Current': String(result.current),
                'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
                'Retry-After': String(result.retryAfter),
            },
        });
    }

    return response;

}

export const config = {
    matcher: [
        "/dashboard",
        "/me",
        "/transactions/new",
        "/transactions/history",
        "/accounts/new",
        "/categories/new",
        "/me",
    ],
}