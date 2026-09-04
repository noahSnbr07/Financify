import { database } from '@/src/configuration';
import { TransactionType } from '@/src/generated/prisma/enums';
import { APIResponse } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { NextResponse, NextRequest } from 'next/server';

interface CreateTransactionShape {
    value: number;
    name: string;
    categoryId: string;
    accountId: string;
    spent: boolean;
}

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse>> {

    const rawData: CreateTransactionShape = await _request.json();
    const { accountId, categoryId, name, spent, value } = rawData;

    const auth = await getAuth();
    if (!auth) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    try {
        const newTransaction = await database.transaction.create({
            data: {
                type: TransactionType.manual,
                name,
                value,
                received: !spent,
                user: {
                    connect: { id: auth.id },
                },
                account: {
                    connect: { id: accountId }
                },
                category: {
                    connect: { id: categoryId }
                },
            },
        });

        console.log(newTransaction)

        if (!newTransaction) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "New transaction could not be created" }));

        const response = apiResponsePresets.CREATED({ message: "Transaction created successfully." });
        return NextResponse.json(response, { status: response.status });

    } catch (error) {
        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }))
    }
}