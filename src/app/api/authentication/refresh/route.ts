import { NextRequest, NextResponse } from "next/server";
import { refreshAuth } from "@/utils/functions/auth-tools";

export async function POST(request: NextRequest) {
    try {
        const { refreshToken } = await request.json();

        const refreshed = await refreshAuth(refreshToken);
        if (!refreshed) {
            return NextResponse.json({ error: "User not found" }, { status: 401 });
        }

        return NextResponse.json({ newAccessToken: refreshed.accessToken });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    }
}