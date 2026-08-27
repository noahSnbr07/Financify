import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    const { categoryId }: { categoryId: string; } = await _request.json();

    const validId: boolean = categoryId.trim().length === 36;

    if (!validId) return NextResponse.json(apiResponsePresets.BAD_REQUEST({ message: "Id invalid." }));

    try {
        const targetCategory = await database.category.findUnique({ where: { id: categoryId } });

        if (!targetCategory) return NextResponse.json(apiResponsePresets.NOT_FOUND({ message: "Category not found." }));

        await database.transaction.deleteMany({
            where: {
                AND: [
                    { categoryId: categoryId },
                    { userId: auth.id }
                ]
            }
        });

        await database.category.delete({ where: { id: categoryId } })

        return NextResponse.json(apiResponsePresets.OK({ message: "Category deleted." }));

    } catch (error) {
        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }))
    }
}