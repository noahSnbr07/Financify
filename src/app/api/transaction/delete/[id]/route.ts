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

    try {

        const targetTransaction = await database.transaction.findFirst({
            where: {
                AND: [
                    { id }, { user: { id: auth.id } }
                ],
            },
            select: {
                user: { select: { id: true } }
            }
        });

        if (!targetTransaction) return NextResponse.json(apiResponsePresets.NOT_FOUND({ message: "Transaction not found" }));
        if (targetTransaction.user.id !== auth.id) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

        await database.transaction.delete({
            where: {
                id,
            },
        },);

        return NextResponse.json(apiResponsePresets.OK({ message: "Transaction deleted." }));

    } catch (error) {
        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }))
    }
}