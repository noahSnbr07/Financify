import { Ollama } from 'ollama'

import { APIResponse } from '@/src/interfaces';
import { getAuth, getOllamaHost } from '@/src/server';
import { NextResponse, NextRequest } from 'next/server';
import { prompts } from '@/src/assets';
import { database } from '@/src/configuration';
import { apiResponsePresets } from '@/src/static';

type ParsedTransactions = {
    name: string;
    value: number;
    category: string;
    account: string;
    date: string;
}[];

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    try {
        const transactions = await database.transaction.findMany({
            select: {
                account:
                {
                    select: {
                        name: true
                    }
                },
                category: {
                    select: {
                        name: true
                    }
                },
                name:
                    true,
                value: true,
                received: true,
                created:
                    true,
            },
            where: { userId: auth.id }, take: 20,
            orderBy: { created: "desc", }
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

        return NextResponse.json(apiResponsePresets.OK({ message: response.message.content }));
    } catch (error) {
        console.error(error)
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error" }))
    }
}