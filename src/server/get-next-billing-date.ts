import { SubscriptionInterval } from "../generated/prisma/enums";

interface _props {
    interval: SubscriptionInterval;
    date: Date;
}

async function getNextBillingDate({ date, interval }: _props): Promise<Date> {

    const next = new Date(date);

    switch (interval) {
        case 'weekly':
            next.setDate(next.getDate() + 7);
            break;
        case 'monthly':
            next.setMonth(next.getMonth() + 1);
            break;
        case 'quarterly':
            next.setMonth(next.getMonth() + 3);
            break;
        case 'annual':
            next.setFullYear(next.getFullYear() + 1);
            break;
    }

    return next;
}

export default getNextBillingDate;