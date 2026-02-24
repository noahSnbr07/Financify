import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { NextResponse, NextRequest } from 'next/server';
import { compare } from "bcrypt"
import { sign } from "jsonwebtoken";
import { cookies } from 'next/headers';
import { databaseLog } from '@/src/server';

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse<null>>> {

    const cookieStore = await cookies();

    const { name, password }: { name: string; password: string; } = await _request.json();
    console.log({ name, password });

    const valid = Boolean(
        (name && name.trim().length >= 4) &&
        (password && password.trim().length >= 4)
    );

    if (!valid) return NextResponse.json({
        data: null,
        message: "Invalid Inputs",
        status: 400,
        success: false,
    });

    const targetUser = await database.user.findUnique({ where: { name } });
    if (!targetUser) return NextResponse.json({
        data: null,
        message: "User not found",
        status: 404,
        success: false,
    });

    const hashMatch = await compare(password, targetUser.hash);
    if (!hashMatch) return NextResponse.json({
        data: null,
        message: "Hash mismatch",
        status: 400,
        success: false,
    });

    await databaseLog({ type: "Authentication", userId: targetUser.id, message: "Logged In" });

    const token = sign({
        name: targetUser.name,
        id: targetUser.id,
        created: targetUser.created,
        updated: targetUser.updated,
        avatar: targetUser.avatar
    },
        process.env.JWT_SECRET as string,
        { algorithm: "HS256", expiresIn: "24h" });

    cookieStore.set({
        name: "financify-token",
        value: token,
        httpOnly: true,
        maxAge: 24 * 60 * 60,
        priority: "high",
        sameSite: "lax",
    });

    return NextResponse.json({
        data: null,
        message: "",
        status: 200,
        success: true,
    });

}