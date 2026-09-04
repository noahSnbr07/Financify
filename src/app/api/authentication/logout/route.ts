import { APIResponse } from '@/src/interfaces';
import { apiResponsePresets } from '@/src/static';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse<APIResponse>> {

    try {
        const cookieStore = await cookies();

        cookieStore.delete("financify-access-token");
        cookieStore.delete("financify-refresh-token");

        return NextResponse.json(apiResponsePresets.OK({ message: "Logged out." }));

    } catch (error) {

        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error" }))
    }
}
