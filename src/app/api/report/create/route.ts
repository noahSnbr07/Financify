import { database } from '@/src/configuration';
import { FileExtension, FileMime, FileType } from '@/src/generated/prisma/enums';
import { APIResponse } from '@/src/interfaces';
import { getAuth, uploadFile } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse<APIResponse>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    const identifier = new Date().getTime();

    try {
        //pull all data
        const [transactions, accounts, categories, subscriptions] = await Promise.all([
            database.transaction.findMany({ where: { userId: auth.id } }),
            database.account.findMany({ where: { userId: auth.id } }),
            database.category.findMany({ where: { userId: auth.id } }),
            database.subscription.findMany({ where: { userId: auth.id } }),
        ]);


        const fileBinary = new File([JSON.stringify({
            meta: {
                created: {
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString(),
                    iso: new Date().toISOString(),
                },
                format: "json/JSON/.json",
                reportId: identifier,
                counts: {
                    transactions: transactions.length,
                    accounts: accounts.length,
                    categories: categories.length,
                    subscriptions: subscriptions.length,
                }
            },
            user: auth,
            transactions, accounts, categories, subscriptions,
        }, null, 2)], `report-${identifier}.json`, { type: 'application/json' });


        await uploadFile({
            extension: FileExtension.json,
            file: fileBinary,
            mime: FileMime.application,
            type: FileType.REPORT,
            userId: auth.id
        })

        return NextResponse.json(apiResponsePresets.OK({ message: "Report created." }))

    } catch (error) {
        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }))
    }
}