import { NextRequest, NextResponse } from 'next/server'
import { getClientIp, rateLimiter, RateLimitPresets } from './rate-limiting';
import { verify, sign } from 'jsonwebtoken';
import { database } from '@/src/configuration';

export default async function proxy(request: NextRequest): Promise<NextResponse> {
    const accessToken = request.cookies.get("financify-access-token")?.value;
    const refreshToken = request.cookies.get("financify-refresh-token")?.value;

    // Skip if no access token
    if (!accessToken) {
        return NextResponse.next();
    }

    // Skip static files
    if (
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/static') ||
        request.nextUrl.pathname.match(/\.(js|css|png|jpg|gif|ico|svg?)$/)
    ) {
        return NextResponse.next();
    }

    const clientIp = getClientIp(request);
    const pathname = request.nextUrl.pathname;
    const response = NextResponse.next();

    // Determine rate limit config
    const config = pathname.startsWith('/api/authentication/login')
        ? RateLimitPresets.auth
        : RateLimitPresets.standard;

    // Check rate limit first
    const result = rateLimiter.check(clientIp, config.limit, config.window);

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

    // Verify access token
    try {
        verify(accessToken, process.env.JWT_SECRET as string, { algorithms: ["HS256"] });
        return response;
    } catch (error) {
        // Token expired, try to refresh
        if (!refreshToken) {
            return NextResponse.redirect("/authentication", 308)
        }

        try {
            const decoded = verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET as string,
                { algorithms: ["HS256"] }
            ) as { userId: string; };

            // Get user from database
            const user = await database.user.findUnique({
                where: { id: decoded.userId },
                omit: { hash: true },
            });

            if (!user) {
                return response;
            }

            // Create new access token
            const newAccessToken = sign(user, process.env.JWT_SECRET as string, {
                algorithm: "HS256",
                expiresIn: "15m",
            });

            // Set new token in response
            response.cookies.set({
                name: "financify-access-token",
                value: newAccessToken,
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7,
                priority: "high",
                sameSite: "lax",
            });

            return response;
        } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            return response;
        }
    }
}

export const config = {
    matcher: [
        "/dashboard",
        "/me",
        "/transactions/new",
        "/transactions/history",
        "/accounts/new",
        "/categories/new",
    ],
};