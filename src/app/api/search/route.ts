import { database } from '@/src/configuration';
import { SearchResultAccount, SearchResultCategory, SearchResultSubscription, SearchResultTransaction } from '@/src/hooks/use-search-data';
import { APIResponseWithData } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { NextResponse, NextRequest } from 'next/server';

export type SearchResult = {
    transactions: SearchResultTransaction[];
    categories: SearchResultCategory[];
    accounts: SearchResultAccount[];
    subscriptions: SearchResultSubscription[];
}

const emptyDataSet = { accounts: [], categories: [], subscriptions: [], transactions: [] }
export const revalidate = 60;

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponseWithData<SearchResult>>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json({ ...apiResponsePresets.UNAUTHORIZED(), data: emptyDataSet });

    const { query }: { query: string } = await _request.json();

    const queryConfig = {
        where: { user: { id: auth.id, }, name: { contains: query } },
        orderBy: { created: "desc" as const },
        take: 5,
    }

    try {

        const [transactions, categories, accounts, subscriptions] = await Promise.all([
            database.transaction.findMany(queryConfig),
            database.category.findMany(queryConfig),
            database.account.findMany(queryConfig),
            database.subscription.findMany(queryConfig)
        ]);

        return NextResponse.json({ ...apiResponsePresets.OK({ message: "success" }), data: { transactions, categories, accounts, subscriptions, } })

    } catch (error) {
        console.error(error);
        if (error instanceof Error) return NextResponse.json({ ...apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }), data: emptyDataSet });
        else return NextResponse.json({ ...apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }), data: emptyDataSet });
    }
}