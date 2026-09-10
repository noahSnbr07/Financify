import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse<APIResponse>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    const { id }: { id: Readonly<string>; } = await params;

    const validId = Boolean(id && id.length > 0);
    if (!validId) return NextResponse.json(apiResponsePresets.BAD_REQUEST({ message: "Invalid Id." }));

    const query = {
        where: {
            id: id,
            userId: auth.id,
        }
    }

    try {

        const targetAccount = await database.account.findUnique(query);
        if (!targetAccount) return NextResponse.json(apiResponsePresets.NOT_FOUND({ message: "Account not found" }));

        await database.$transaction(async (transaction) => {
            await transaction.transaction.deleteMany({
                where: {
                    accountId: id,
                    userId: auth.id,
                },
            });
            await transaction.subscription.deleteMany({
                where: {
                    accountId: id,
                    userId: auth.id,
                },
            });
            await transaction.account.delete(query);
        });

        return NextResponse.json(apiResponsePresets.OK({ message: "Account deleted successfully" }));

    } catch (error) {
        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }))
    }
}