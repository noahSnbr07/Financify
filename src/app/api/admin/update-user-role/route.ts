import { database } from '@/src/configuration';
import { UserRole } from '@/src/generated/prisma/enums';
import { APIResponse } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse>> {

    const auth = await getAuth();
    if (!auth || auth.role !== UserRole.admin) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    const { newRole, userId }: { newRole: UserRole, userId: string; } = await _request.json();

    try {
        const targetUser = await database.user.findUnique({ where: { id: userId } });
        if (!targetUser) return NextResponse.json(apiResponsePresets.NOT_FOUND({ message: "User not found" }));

        await database.user.update({ where: { id: userId }, data: { role: newRole } });
        return NextResponse.json(apiResponsePresets.OK({ message: "User Role Updated" }));

    } catch (error) {
        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }))
    }
}