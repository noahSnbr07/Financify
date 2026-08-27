import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { NextResponse, NextRequest } from 'next/server';

interface CreateTransactionShape {
    value: number;
    name: string;
    category: string;
    account: string;
    spent: boolean;
}

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse>> {

    const rawData: CreateTransactionShape = await _request.json();
    const { account, category, name, spent, value } = rawData;

    const auth = await getAuth();
    if (!auth) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    try {
        await database.transaction.create({
            data: {
                name,
                value,
                received: !spent,
                user: {
                    connect: { id: auth.id },
                },
                account: {
                    connect: { id: account }
                },
                category: {
                    connect: { id: category }
                },
            },
        });

        return NextResponse.json(apiResponsePresets.CREATED({ message: "Transaction created successfully." }));

    } catch (error) {
        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }))
    }
}