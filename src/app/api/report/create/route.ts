import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { writeFileSync, mkdirSync } from 'fs';
import { NextResponse } from 'next/server';
import { join } from 'path';

export async function POST(): Promise<NextResponse<APIResponse>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    const identifier = new Date().getTime();

    try {
        await database.report.create({
            data: {
                user: {
                    connect: {
                        id: auth.id
                    },
                },
                filename: String(identifier),
            }
        });

        //pull all data
        const [transactions, accounts, categories] = await Promise.all([
            database.transaction.findMany({ where: { userId: auth.id } }),
            database.account.findMany({ where: { userId: auth.id } }),
            database.category.findMany({ where: { userId: auth.id } }),
        ]);

        //create the parent directory
        mkdirSync(join(process.cwd(), 'data/backups'), { recursive: true });

        //construct the absolute path to thr requested file
        const filePath = join(process.cwd(), 'data/backups', `${String(identifier)}.json`);

        const fileBinary = JSON.stringify({
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
                }
            },
            user: auth,
            transactions, accounts, categories
        }, null, 2);


        writeFileSync(filePath, fileBinary);

        return NextResponse.json(apiResponsePresets.OK({ message: "Report created." }))

    } catch (error) {
        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }))
    }
}