import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from './server/check-rate-limit';
import { getClientIP } from './server';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { LIMIT_PRESETS } from './static';
import { writeTrafficLogToRedis } from '@/utils/functions/traffic-logger';
import {
    COOKIE_LIFETIME,
    TOKEN_IDENTIFIERS,
    refreshAuth,
    verifyAccessToken,
} from '@/utils/functions/auth-tools';

export default async function proxy(request: NextRequest): Promise<NextResponse> {

    const accessToken = request.cookies.get(TOKEN_IDENTIFIERS.ACCESS)?.value;
    const refreshToken = request.cookies.get(TOKEN_IDENTIFIERS.REFRESH)?.value;

    const response = NextResponse.next();

    const redirectToAuthentication = (): NextResponse => {
        const authenticationResponse = NextResponse.redirect(
            new URL("/authentication", request.nextUrl),
            307,
        );

        authenticationResponse.cookies.set({
            name: TOKEN_IDENTIFIERS.ACCESS,
            value: "",
            expires: new Date(0),
            httpOnly: true,
            path: "/",
        });
        authenticationResponse.cookies.set({
            name: TOKEN_IDENTIFIERS.REFRESH,
            value: "",
            expires: new Date(0),
            httpOnly: true,
            path: "/",
        });

        return authenticationResponse;
    };

    if (
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/static') ||
        request.nextUrl.pathname.match(/\.(js|css|png|jpg|gif|ico|svg?)$/) ||
        request.nextUrl.pathname.startsWith('/authentication')

    ) {
        return response;
    }

    void writeTrafficLogToRedis({ request });

    const keyPath = (query: string): boolean => request.nextUrl.pathname.startsWith(query);

    let preset: RateLimiterRedis | null = LIMIT_PRESETS.STRICT;

    if (keyPath("/api/authentication/login")) preset = LIMIT_PRESETS.AUTH;
    else if (keyPath("/api/authentication/register")) preset = LIMIT_PRESETS.AUTH;

    else if (keyPath("/api/resource/upload")) preset = LIMIT_PRESETS.STRICT;
    else if (keyPath("/api/me/avatar/update")) preset = LIMIT_PRESETS.STRICT;

    else if (keyPath("/api/ai/")) preset = LIMIT_PRESETS.AI;
    else preset = LIMIT_PRESETS.STANDARD;

    if (!preset) {
        return response;
    }

    const ip = await getClientIP({ request });

    const { success, retryAfter } = await checkRateLimit(ip, preset);

    if (!success) {
        return NextResponse.json(
            { error: 'Too many requests' },
            {
                status: 429,
                headers: { 'Retry-After': Math.ceil(retryAfter || 60).toString() },
            }
        );
    }

    if (accessToken && verifyAccessToken(accessToken)) {
        return response;
    }

    if (!refreshToken) {
        return accessToken ? redirectToAuthentication() : response;
    }

    const refreshed = await refreshAuth(refreshToken);
    if (!refreshed) return redirectToAuthentication();

    request.cookies.set(TOKEN_IDENTIFIERS.ACCESS, refreshed.accessToken);
    const refreshedResponse = NextResponse.next({ request });
    refreshedResponse.cookies.set({
        name: TOKEN_IDENTIFIERS.ACCESS,
        value: refreshed.accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: COOKIE_LIFETIME,
        priority: "high",
        sameSite: "lax",
        path: "/",
    });

    return refreshedResponse;
}
