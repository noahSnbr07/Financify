import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { APIResponseWithData } from '@/src/interfaces/api-response';
import { getAuth } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { NextResponse, NextRequest } from 'next/server';

/*
 * RETURNS:
 * new budget exceeding in %
 * old balance in <currency>
 * new balance in <currency>
 * -------------------------------
 * old balance in <budget_exceed_%>
 * new balance in <budget_exceed_%>
 * -------------------------------
 * transaction value in <currency>
 * transaction value in <budget_exceed_%>
 *
 *  
*/

export interface ReturnedData {
    oldBalance: number;
    newBalance: number;
    oldBudget: number;
    newBudget: number;
    transactionValue: number;
    transactionBudget: number;
}

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponseWithData<ReturnedData>>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json({
        ...apiResponsePresets.UNAUTHORIZED(), data: {
            oldBalance: 0,
            newBalance: 0,
            oldBudget: 0,
            newBudget: 0,
            transactionValue: 0,
            transactionBudget: 0,
        }
    });

    const {
        value,
        received,
    }: {
        value: number;
        received: boolean;
    } = await _request.json();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const timeSlideSelection = {
        created: {
            gte: startOfMonth,
            lt: startOfNextMonth
        },
    }

    try {

        //transactions this month
        const [budget, transactions] = await Promise.all([
            database.user.findUnique({ where: { id: auth.id }, select: { budget: true, } }),

            await database.transaction.findMany({
                where: {
                    userId: auth.id,
                    ...timeSlideSelection
                },
            }),
        ]);

        const totalSpending = transactions.filter((t) => !t.received).reduce((acc, curr) => acc + Number(curr.value), 0);
        const oldBalance = Math.round(transactions.reduce((acc, curr) => !curr.received ? acc + Number(curr.value) : acc - Number(curr.value), 0));
        const newBalance = Math.round(received ? oldBalance + value : oldBalance - value);
        const oldBudget = Math.round((totalSpending / (budget?.budget || 1)) * 100);
        const newBudget = received ? oldBudget : Math.round((((totalSpending + value) / (budget?.budget || 1)) * 100));
        const transactionBudget = newBudget - oldBudget;

        return NextResponse.json({
            data: {
                oldBalance,
                newBalance,
                oldBudget,
                newBudget,
                transactionBudget,
                transactionValue: value
            },
            message: "Calculations successful",
            status: 200,
            success: true,
        })

    } catch (error) {
        console.error(error);
        if (error instanceof Error) return NextResponse.json({
            ...apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }),
            data: {
                oldBalance: 0,
                newBalance: 0,
                oldBudget: 0,
                newBudget: 0,
                transactionValue: 0,
                transactionBudget: 0,
            }
        });
        else return NextResponse.json({
            ...apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }),
            data: {
                oldBalance: 0,
                newBalance: 0,
                oldBudget: 0,
                newBudget: 0,
                transactionValue: 0,
                transactionBudget: 0,
            }
        })
    }
}