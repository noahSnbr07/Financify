import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse<APIResponse>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    try {

        await database.$transaction(async (transaction) => {
            const query = { where: { userId: auth.id } };
            await transaction.transaction.deleteMany(query);
            await transaction.subscription.deleteMany(query);
            await transaction.category.deleteMany(query);
            await transaction.account.deleteMany(query);
            await transaction.report.deleteMany(query);
        });

        return NextResponse.json(apiResponsePresets.OK({ message: "All Data deleted" }))

    } catch (error) {

        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error" }))
    }
}