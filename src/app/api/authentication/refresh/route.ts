import { NextRequest, NextResponse } from "next/server";
import { verify, sign } from "jsonwebtoken";
import { database } from "@/src/configuration";

export async function POST(request: NextRequest) {
    try {
        const { refreshToken } = await request.json();

        const decoded = verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string,
            { algorithms: ["HS256"] }
        ) as { userId: string };

        const user = await database.user.findUnique({
            where: { id: decoded.userId },
            omit: { hash: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 401 });
        }

        const newAccessToken = sign(
            user,
            process.env.JWT_SECRET as string,
            { algorithm: "HS256", expiresIn: "1m" }
        );

        return NextResponse.json({ newAccessToken });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    }
}