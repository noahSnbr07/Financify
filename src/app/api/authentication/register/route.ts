import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { databaseLog } from '@/src/server';
import { hash } from 'bcrypt';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse<null>>> {

    const { name, password }: { name: string; password: string; } = await _request.json();

    const valid = Boolean(
        name && name.trim().length > 1 &&
        password && password.trim().length > 1
    );

    if (!valid) return NextResponse.json({
        data: null,
        message: "Invalid Form Inputs",
        status: 400,
        success: false
    });

    try {

        const targetUser = await database.user.findUnique({ where: { name } });
        if (targetUser) return NextResponse.json({
            data: null,
            message: "Username Reserved",
            status: 400,
            success: false,
        });

        const hashedPassword = await hash(password, 4);

        const newUser = await database.user.create({
            data: { name, hash: hashedPassword, avatar: "default.png" }
        });

        await databaseLog({ type: "Authentication", userId: newUser.id, message: "Account Created" });

        return NextResponse.json({
            data: null,
            message: "Account Created",
            status: 200,
            success: true,
        });

    } catch (error) {
        console.error(error);
        await databaseLog({ type: "Authentication", userId: "<no id>", message: "Registration Failed" });
        return NextResponse.json({
            data: null,
            message: "Uncaught Error",
            status: 500,
            success: false,
        });
    }
}