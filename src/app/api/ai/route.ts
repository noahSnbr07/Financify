import { Ollama } from 'ollama'

import { APIResponse } from '@/src/interfaces';
import { getAuth, getOllamaHost } from '@/src/server';
import { NextResponse, NextRequest } from 'next/server';
import { prompts } from '@/src/assets';
import { database } from '@/src/configuration';

type ParsedTransactions = {
    name: string;
    value: number;
    category: string;
    account: string;
    date: string;
}[];

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse<string>>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json({
        data: "unauthorized to access resource",
        message: "authorization failed",
        status: 400,
        success: false
    });

    try {
        const transactions = await database.transaction.findMany({
            select: {
                account: { select: { name: true } }, category: { select: { name: true } }, name: true, value: true, received: true, created: true
            }, where: { userId: auth.id }, take: 20
        });

        const { prompt }: { prompt: string; } = await _request.json();

        const parsedTransactions: ParsedTransactions = transactions.map((transaction) => ({
            value: transaction.value.toNumber(),
            name: transaction.name,
            category: transaction.category.name,
            account: transaction.account.name,
            date: transaction.created.toLocaleDateString(),
        }));

        const ollamaHost = await getOllamaHost();

        const ollama = new Ollama({
            host: ollamaHost,
        });

        const response = await ollama.chat({
            model: process.env.OLLAMA_MODEL || "gemma:2b",
            messages: [
                ...prompts.map((prompt) => ({
                    role: "system",
                    content: prompts[prompt.id].content
                })),
                {
                    role: "system",
                    content: `Recent Transaction Data:\n${JSON.stringify(parsedTransactions, null, 2)}`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
        });

        return NextResponse.json({
            data: response.message.content,
            message: "Successfully prompted AI",
            status: 200,
            success: true,
        });
    } catch (error) {
        return NextResponse.json({
            data: error instanceof Error ? error.message : "null",
            message: "Uncaught Server Error",
            status: 500,
            success: false,
        })
    }
}