import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { getAuth, getTotalAccountVolume } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { NextRequest, NextResponse } from 'next/server';

export interface CreateTransferProps {
    value: number;
    name: string;
    originAccountId: string;
    destinationAccountId: string;
}

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    const {
        destinationAccountId,
        name,
        originAccountId,
        value,
    }: CreateTransferProps = await _request.json();

    const validData = Boolean(
        destinationAccountId && destinationAccountId.length > 0 &&
        name && name.length > 0 &&
        originAccountId && originAccountId.length > 0 &&
        value && value > 0,
    );

    if (!validData) return NextResponse.json(apiResponsePresets.BAD_REQUEST({ message: "Invalid Data" }));

    try {

        const [destinationAccount, originAccount] = await Promise.all([
            database.account.findUnique({ where: { id: destinationAccountId, user: { id: auth.id } } }),
            database.account.findUnique({ where: { id: originAccountId, user: { id: auth.id } } }),
        ]);

        const validTransferPath = Boolean(
            destinationAccount &&
            originAccount &&
            destinationAccount.id !== originAccount.id
        );

        if (!validTransferPath) {
            return NextResponse.json(apiResponsePresets.BAD_REQUEST({ message: "Invalid transfer accounts" }));
        }

        const originAccountBalance = await getTotalAccountVolume({ accountId: originAccount!.id, auth });
        if (originAccountBalance < value) {
            return NextResponse.json(apiResponsePresets.BAD_REQUEST({ message: "Origin account does not have enough balance for this transfer" }));
        }

        await database.transfer.create({
            data: {
                name: name,
                value: value,
                destinationAccountId,
                originAccountId,
                userId: auth.id
            }
        });

        return NextResponse.json(apiResponsePresets.OK({ message: "Transfer created successfully" }));


    } catch (error) {
        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }))
    }
}