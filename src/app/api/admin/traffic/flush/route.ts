import { UserRole } from '@/src/generated/prisma/enums';
import { APIResponse } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { redis } from '@/src/static/rate-limit-preset';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse>> {
    const auth = await getAuth();
    if (!auth || auth.role !== UserRole.admin) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    try {

        await redis!.del("proxy:traffic");
        return NextResponse.json(apiResponsePresets.OK({ message: "Traffic Logs Flushed" }));

    } catch (error) {
        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }))
    }
}