import { APIResponseWithData, User } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse<APIResponseWithData<User | null>>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json({
        data: null,
        message: "Auth failed",
        status: 500,
        success: false,
    }, { status: 401 });

    return NextResponse.json({
        data: auth,
        message: "",
        status: 200,
        success: true
    });
}