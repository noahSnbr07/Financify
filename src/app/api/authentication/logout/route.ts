import { APIResponse } from '@/src/interfaces';
import { databaseLog, getAuth } from '@/src/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse<APIResponse<null>>> {

    const cookieStore = await cookies();
    const auth = await getAuth();

    if (!auth) return NextResponse.json({
        data: null,
        message: "Authentication failed",
        status: 200,
        success: false,
    });

    cookieStore.delete("financify-token");

    await databaseLog({ type: "Authentication", userId: auth.id, message: "Logged out" })

    return NextResponse.json({
        data: null,
        message: "Logged out",
        status: 200,
        success: true
    });
}