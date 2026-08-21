import { APIResponse } from '@/src/interfaces';
import { databaseLog, getAuth } from '@/src/server';
import wipeData from '@/src/server/wipe-data';
import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse<APIResponse<null>>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json({
        data: null,
        message: "Authentication failed",
        status: 403,
        success: false,
    });

    try {
        await wipeData();
        databaseLog({ type: "Mutation", userId: auth.id, message: "Wiped Data" });
        return NextResponse.json({
            data: null,
            message: "Wiped Data successfully",
            status: 200,
            success: true,
        })

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            data: null,
            message: "Unexpected Server Error",
            status: 500,
            success: false,
        })
    }
}