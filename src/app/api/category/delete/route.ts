import { database } from '@/src/configuration';
import { APIResponse } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse<null>>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json({
        data: null,
        message: "Authentication failed",
        status: 403,
        success: false,
    });

    const { categoryId }: { categoryId: string; } = await _request.json();

    const validId: boolean = categoryId.trim().length === 36;

    if (!validId) return NextResponse.json({
        message: `Invalid Id: ${categoryId}`,
        status: 400,
        success: false,
        data: null,
    });

    const targetCategory = await database.category.findUnique({ where: { id: categoryId } });

    if (!targetCategory) return NextResponse.json({
        message: `categoryId not found`,
        status: 404,
        success: false,
        data: null,
    });

    await database.transaction.deleteMany({
        where: {
            AND: [
                { categoryId: categoryId },
                { userId: auth.id }
            ]
        }
    });

    await database.category.delete({ where: { id: categoryId } })
        .catch((error: Error) => NextResponse.json({
            message: `An unexpected error occurred: ${error.message}`,
            status: 500,
            success: false,
            data: null,
        }));

    await database.log.create({
        data: {
            message: "Category deleted",
            type: "Mutation",
            user: {
                connect: {
                    id: auth.id
                },
            },
        },
    })

    return NextResponse.json({
        message: `Category deleted`,
        status: 200,
        success: true,
        data: null,
    });

}