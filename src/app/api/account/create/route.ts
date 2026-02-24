import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { databaseLog, getAuth } from '@/src/server';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse<null>>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json({
        data: null,
        message: "Authentication failed",
        status: 403,
        success: false,
    });

    const { color, name }: { color: string; name: string; } = await _request.json();

    const validRequestBody = Boolean(
        color && color.trim().length > 0 &&
        name && name.trim().length > 0
    );

    if (!validRequestBody) return NextResponse.json({
        data: null,
        message: "Invalid Form Body",
        status: 400,
        success: false
    });

    try {
        const newAccount = await database.account.create({
            data: {
                color,
                name,
                user: { connect: { id: auth.id } }
            }
        });

        if (!newAccount) return NextResponse.json({
            data: null,
            message: "Operation failed",
            status: 500,
            success: false
        })

        return NextResponse.json({
            data: null,
            message: "Account Created",
            status: 200,
            success: true,
        })

    } catch (error) {

        console.error(error);
        await databaseLog({ type: "Error", userId: auth.id, message: "Couldn't INSERT Account" })

        return NextResponse.json({
            data: null,
            message: "Uncaught Error occurred",
            status: 500,
            success: true,
        });
    }
}