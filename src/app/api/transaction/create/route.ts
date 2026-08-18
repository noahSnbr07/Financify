import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { databaseLog, getAuth } from '@/src/server';
import { NextResponse, NextRequest } from 'next/server';

interface CreateTransactionShape {
    value: number;
    name: string;
    category: string;
    account: string;
    spent: boolean;
}

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse<null>>> {

    const rawData: CreateTransactionShape = await _request.json();
    const { account, category, name, spent, value } = rawData;

    const auth = await getAuth();
    if (!auth) return NextResponse.json({ data: null, message: "Authentication failed", status: 403, success: false });

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

        await databaseLog({ type: "Mutation", message: "Transaction Create", userId: auth.id });

        return NextResponse.json({ data: null, message: "Transaction Created", status: 200, success: true });

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            data: null, message: "Internal Server Error", status: 500, success: false,
        });
    }
}