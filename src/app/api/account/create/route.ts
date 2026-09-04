import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    const { color, name }: { color: string; name: string; } = await _request.json();

    const validRequestBody = Boolean(
        color && color.trim().length > 0 &&
        name && name.trim().length > 0
    );

    if (!validRequestBody) return NextResponse.json(apiResponsePresets.BAD_REQUEST({ message: "Either color or name invalid." }));

    try {
        await database.account.create({
            data: {
                color,
                name,
                user: { connect: { id: auth.id } }
            }
        });

        return NextResponse.json(apiResponsePresets.OK({ message: "New account created." }));

    } catch (error) {
        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }))
    }
}