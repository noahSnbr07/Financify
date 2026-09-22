import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { COOKIE_LIFETIME, TOKEN_IDENTIFIERS, refreshAuth } from '@/utils/functions/auth-tools';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json({
        data: null,
        message: "Authentication failed",
        status: 409,
        success: false
    });

    const refreshToken = _request.cookies.get(TOKEN_IDENTIFIERS.REFRESH)?.value;
    if (!refreshToken) {
        return NextResponse.json(apiResponsePresets.UNAUTHORIZED());
    }

    const { budget } = await _request.json();

    if (budget <= 0) return NextResponse.json(apiResponsePresets.BAD_REQUEST({ message: "Budget must be greater than 0." }))

    try {
        await database.user.update({
            where: { id: auth.id },
            data: { budget, }
        });

        const refreshed = await refreshAuth(refreshToken);
        if (!refreshed) {
            return NextResponse.json({
                data: null,
                message: "Authentication failed",
                status: 401,
                success: false,
            });
        }

        const response = NextResponse.json({
            data: null,
            message: "Budget Updated successfully",
            status: 200,
            success: true,
        });

        response.cookies.set({
            name: TOKEN_IDENTIFIERS.ACCESS,
            value: refreshed.accessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: COOKIE_LIFETIME,
            priority: "high",
            sameSite: "lax",
            path: "/",
        });

        return response;

    } catch (error) {
        console.error(error)
        return NextResponse.json({
            data: null,
            message: "Uncaught Server Error",
            status: 500,
            success: false,
        })
    }

}