import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { apiResponsePresets } from '@/src/static';
import { hash } from 'bcrypt';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse>> {

    const { name, password }: { name: string; password: string; } = await _request.json();

    const valid = Boolean(
        name && name.trim().length > 1 &&
        password && password.trim().length > 1
    );

    if (!valid) return NextResponse.json(apiResponsePresets.BAD_REQUEST({ message: "Name and password must be at least 4 characters." }));

    try {

        const targetUser = await database.user.findUnique({ where: { name } });
        if (targetUser) return NextResponse.json(apiResponsePresets.BAD_REQUEST({ message: "Username reserved." }));

        const hashedPassword = await hash(password, 4);

        await database.user.create({
            data: { name, hash: hashedPassword, avatar: "error.png", budget: 100 }
        });

        return NextResponse.json(apiResponsePresets.CREATED({ message: "User created." }));

    } catch (error) {
        console.error(error);

        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }))
    }
}