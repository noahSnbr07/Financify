"use server";

import { COOKIE_LIFETIME, TOKEN_IDENTIFIERS, refreshAuth, type AuthenticatedUser } from '@/utils/functions/auth-tools';
import { cookies } from 'next/headers';

export default async function refreshAccessToken(refreshToken: string): Promise<AuthenticatedUser | null> {
    const refreshed = await refreshAuth(refreshToken);
    if (!refreshed) return null;

    const cookieStore = await cookies();
    cookieStore.set({
        name: TOKEN_IDENTIFIERS.ACCESS,
        value: refreshed.accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: COOKIE_LIFETIME,
        sameSite: "lax",
        path: "/",
    });

    return refreshed.user;
}