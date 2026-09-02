import { CreateSubscriptionType } from '@/src/app/subscriptions/new/components/new-subscription-form';
import { database } from '@/src/configuration';
import { SubscriptionInterval } from '@/src/generated/prisma/enums';
import { APIResponse } from '@/src/interfaces';
import { getAuth, getNextBillingDate } from '@/src/server';
import { apiResponsePresets } from '@/src/static';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(_request: NextRequest): Promise<NextResponse<APIResponse>> {

    const auth = await getAuth();
    if (!auth) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    const {
        interval,
        name,
        startDate,
        value,
        accountId,
        categoryId,
    }: CreateSubscriptionType = await _request.json();

    const validRequestBody = Boolean(
        accountId && accountId.length > 0 &&
        categoryId && categoryId.length > 0 &&
        name && name.trim().length > 0 &&
        interval && Object.values(SubscriptionInterval).includes(interval) &&
        new Date(startDate) instanceof Date
    );

    if (!validRequestBody) return NextResponse.json(apiResponsePresets.BAD_REQUEST({ message: "Form data invalid." }));

    try {

        const nextBillingDate = await getNextBillingDate({ date: new Date(startDate), interval });

        await database.subscription.create({
            data: {
                name,
                value,
                startDate,
                userId: auth.id,
                nextBillingDate,
                accountId,
                categoryId,
            }
        });

        return NextResponse.json({ message: "Subscription created successfully.", status: 200, success: true });

    } catch (error) {
        console.error(error);
        if (error instanceof Error) return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: error.message }));
        else return NextResponse.json(apiResponsePresets.INTERNAL_SERVER_ERROR({ error: "Uncaught server error." }))
    }
}