import { APIResponse } from '@/src/interfaces';
import { apiResponsePresets } from '@/src/static';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { TOKEN_IDENTIFIERS } from '@/utils/functions/auth-tools';

export async function POST(): Promise<NextResponse<APIResponse>> {

    try {
        const cookieStore = await cookies();

        cookieStore.delete(TOKEN_IDENTIFIERS.ACCESS);
        cookieStore.delete(TOKEN_IDENTIFIERS.REFRESH);

        return NextResponse.json(apiResponsePresets.OK({ message: "Logged out." }));

    } catch (error) {

        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error" }))
    }
}
