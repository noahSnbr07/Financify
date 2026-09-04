import { database } from '@/src/configuration';
import { SubscriptionState } from '@/src/generated/prisma/enums';
import { APIResponse } from '@/src/interfaces';
import { getAuth } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest, { params }: { params: Promise<{ uuid: string }> }): Promise<NextResponse<APIResponse>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    const { uuid }: { uuid: Readonly<string>; } = await params;

    const validId = Boolean(uuid && uuid.length > 0);
    if (!validId) return NextResponse.json(apiResponsePresets.BAD_REQUEST({ message: "Invalid Id." }));

    const query = {
        where: {
            id: uuid,
            userId: auth.id,
        }
    }

    try {

        const targetSubscription = await database.subscription.findUnique(query);
        if (!targetSubscription) return NextResponse.json(apiResponsePresets.NOT_FOUND({ message: "Subscription not found" }));

        await database.subscription.update({ ...query, data: { state: SubscriptionState.canceled } });

        return NextResponse.json(apiResponsePresets.OK({ message: "Subscription deleted successfully" }));

    } catch (error) {
        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }))
    }
}