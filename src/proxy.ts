import { NextRequest, NextResponse } from 'next/server'
import { verify, sign } from 'jsonwebtoken';
import { database } from '@/src/configuration';
import { checkRateLimit } from './server/check-rate-limit';
import { getClientIP } from './server';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { LIMIT_PRESETS } from './static';

export default async function proxy(request: NextRequest): Promise<NextResponse> {

    const accessToken = request.cookies.get("financify-access-token")?.value;
    const refreshToken = request.cookies.get("financify-refresh-token")?.value;

    const response = NextResponse.next();

    if (
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/static') ||
        request.nextUrl.pathname.match(/\.(js|css|png|jpg|gif|ico|svg?)$/) ||
        request.nextUrl.pathname.startsWith('/authentication')

    ) {
        return response;
    }

    let rateLimitPreset: RateLimiterRedis = LIMIT_PRESETS.STRICT;

    if (request.nextUrl.pathname.startsWith("/api/authentication/login")) rateLimitPreset = LIMIT_PRESETS.AUTH;
    if (request.nextUrl.pathname.startsWith("/api/authentication/register")) rateLimitPreset = LIMIT_PRESETS.AUTH;
    else if (request.nextUrl.pathname.startsWith("/api/report/create")) rateLimitPreset = LIMIT_PRESETS.STRICT;
    else if (request.nextUrl.pathname.startsWith("/api/ai/")) rateLimitPreset = LIMIT_PRESETS.AI;
    else rateLimitPreset = LIMIT_PRESETS.STANDARD;

    const ip = await getClientIP({ request });

    const { success, retryAfter } = await checkRateLimit(ip, rateLimitPreset);

    if (!success) {
        return NextResponse.json(
            { error: 'Too many requests' },
            {
                status: 429,
                headers: { 'Retry-After': Math.ceil(retryAfter || 60).toString() },
            }
        );
    }

    try {
        if (!accessToken || accessToken === undefined) return response;

        const user = verify(accessToken || "", process.env.JWT_SECRET as string, { algorithms: ["HS256"] });
        if (!user) response.cookies.delete("financify-access-token");
        return response;
    }
    catch (error) {
        console.error(error);
        if (!refreshToken) return NextResponse.redirect(new URL("/authentication", request.nextUrl), 308)

        try {
            const decoded = verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET as string,
                { algorithms: ["HS256"] }
            ) as { userId: string; };

            const user = await database.user.findUnique({
                where: { id: decoded.userId },
                omit: { hash: true },
            });

            if (!user) {
                return response;
            }

            const newAccessToken = sign(user, process.env.JWT_SECRET as string, {
                algorithm: "HS256",
                expiresIn: "15m",
            });

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