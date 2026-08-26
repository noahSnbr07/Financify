import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    const query = { where: { user: { id: auth.id } } }

    try {

        await Promise.all([
            database.transaction.deleteMany(query),
            database.category.deleteMany(query),
            database.account.deleteMany(query),
            database.report.deleteMany(query),
        ]);

        return NextResponse.json(apiResponsePresets.OK({ message: "All Data deleted" }))

    } catch (error) {

        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error" }))
    }
}