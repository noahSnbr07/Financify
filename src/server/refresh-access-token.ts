"use server";

import { database } from '@/src/configuration';
import { User } from "@/src/interfaces";
import { verify, sign } from "jsonwebtoken";
import { cookies } from 'next/headers';

export default async function refreshAccessToken(refreshToken: string): Promise<User | null> {
    try {
        // Verify refresh token
        const decoded = verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string,
            { algorithms: ["HS256"] }
        ) as { userId: string };

        // Get user from database
        const user = await database.user.findUnique({
            where: { id: decoded.userId },
            omit: { hash: true }
        });

        if (!user) {
            return null;
        }

        // Create new access token
        const newAccessToken = sign(
            user,
            process.env.JWT_SECRET as string,
            { algorithm: "HS256", expiresIn: "1m" }
        );

        // Update cookie with new access token
        const cookieStore = await cookies();
        cookieStore.set({
            name: "financify-access-token",
            value: newAccessToken,
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            priority: "high",
            sameSite: "lax",
        });

        return user as unknown as User;

    } catch (error) {
        console.error(error);
        return null;
    }
}