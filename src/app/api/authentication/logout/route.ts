import { APIResponse } from '@/src/interfaces';
import { apiResponsePresets } from '@/src/static';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse<APIResponse>> {

    const cookieStore = await cookies();

    cookieStore.delete("financify-access-token");
    cookieStore.delete("financify-refresh-token");

    return NextResponse.json(apiResponsePresets.OK({ message: "Logged out." }));
}