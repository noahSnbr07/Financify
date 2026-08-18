import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { writeFileSync, mkdirSync } from 'fs';
import { NextResponse } from 'next/server';
import { join } from 'path';

export async function POST(): Promise<NextResponse<APIResponse<null>>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json({
        data: null,
        message: "Authentication failed",
        status: 400,
        success: false
    });

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
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            data: null,
            message: "Failed creating Report Database Entry",
            status: 500,
            success: false
        })
    }

    //pull all data
    const [transactions, accounts, categories, logs] = await Promise.all([
        database.transaction.findMany({ where: { userId: auth.id } }),
        database.account.findMany({ where: { userId: auth.id } }),
        database.category.findMany({ where: { userId: auth.id } }),
        database.log.findMany({ where: { userId: auth.id } }),
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
                logs: logs.length,
            }
        },
        user: auth,
        transactions, accounts, categories, logs,
    }, null, 2);

    try {
        //read/retrieve the file
        writeFileSync(filePath, fileBinary);
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            data: null,
            message: "Failed to create Report",
            status: 500,
            success: false
        });
    }

    await database.log.create({
        data: {
            message: "Report created",
            type: "Mutation",
            user: { connect: { id: auth.id } },
        }
    })

    return NextResponse.json({
        data: null,
        message: "Report created",
        status: 200,
        success: true
    });
}