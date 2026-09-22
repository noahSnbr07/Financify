import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { NextResponse, NextRequest } from 'next/server';
import { compare } from "bcrypt"
import { cookies } from 'next/headers';
import { apiResponsePresets } from '@/src/static';
import { COOKIE_LIFETIME, TOKEN_IDENTIFIERS, createAccessToken, createRefreshToken } from '@/utils/functions/auth-tools';

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse>> {

    const cookieStore = await cookies();

    const { name, password }: { name: string; password: string; } = await _request.json();

    const valid = Boolean(
        (name && name.trim().length >= 4) &&
        (password && password.trim().length >= 4)
    );

    if (!valid) return NextResponse.json(apiResponsePresets.BAD_REQUEST({ message: "Name and password must be at least 4 characters." }));

    const targetUser = await database.user.findUnique({ where: { name } });
    if (!targetUser) return NextResponse.json(apiResponsePresets.NOT_FOUND({ message: "User could not be found." }));

    const hashMatch = await compare(password, targetUser.hash);
    if (!hashMatch) return NextResponse.json(apiResponsePresets.BAD_REQUEST({ message: "Password incorrect." }));

    try {
        const accessToken = createAccessToken({
            role: targetUser.role,
            name: targetUser.name,
            id: targetUser.id,
            created: targetUser.created,
            updated: targetUser.updated,
            avatar: targetUser.avatar,
            budget: targetUser.budget,
        });

        const refreshToken = createRefreshToken(targetUser.id);

        cookieStore.set({
            name: TOKEN_IDENTIFIERS.ACCESS,
            value: accessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: COOKIE_LIFETIME,
            priority: "high",
            sameSite: "lax",
            path: "/",
        });

        cookieStore.set({
            name: TOKEN_IDENTIFIERS.REFRESH,
            value: refreshToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: COOKIE_LIFETIME,
            priority: "high",
            sameSite: "lax",
            path: "/",
        });

        return NextResponse.json(apiResponsePresets.OK({ message: "Logged in." }));

    } catch (error) {

        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error" }))
    }

}