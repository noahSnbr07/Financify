import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { verify, sign } from 'jsonwebtoken';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json({
        data: null,
        message: "Authentication failed",
        status: 409,
        success: false
    });

    const refreshToken = _request.cookies.get("financify-refresh-token")?.value;
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

        const decoded = verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string,
            { algorithms: ["HS256"] }
        ) as { userId?: string };

        if (!decoded.userId) {
            return NextResponse.json({
                data: null,
                message: "Authentication failed",
                status: 401,
                success: false,
            });
        }

        // Get user from database
        const user = await database.user.findUnique({
            where: { id: decoded.userId },
            omit: { hash: true },
        });

        if (!user) {
            return NextResponse.json({
                data: null,
                message: "Authentication failed",
                status: 401,
                success: false,
            });
        }

        // Create new access token
        const newAccessToken = sign(user, process.env.JWT_SECRET as string, {
            algorithm: "HS256",
            expiresIn: "15m",
        });

        const response = NextResponse.json({
            data: null,
            message: "Budget Updated successfully",
            status: 200,
            success: true,
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