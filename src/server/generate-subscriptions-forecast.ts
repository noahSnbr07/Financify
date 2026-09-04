import { database } from "../configuration";
import { SubscriptionInterval, SubscriptionState } from "../generated/prisma/client";
import { User } from "../interfaces";
import { type SubscriptionForecast } from "./get-dashboard-data";

async function generateSubscriptionsForecast({ auth }: { auth: User }): Promise<SubscriptionForecast> {

    const subscriptions = await database.subscription.findMany({
        where: { user: { id: auth.id }, state: SubscriptionState.active },
        select: {
            name: true,
            value: true,
            nextBillingDate: true,
            interval: true,
            account: { select: { name: true, color: true, } },
            category: { select: { name: true, color: true, } },
        },
        orderBy: { nextBillingDate: "asc" }
    });

    const [weeklySum, monthlySum, quarterlySum, annualSum] = [
        subscriptions.filter((sub) => sub.interval === SubscriptionInterval.weekly)
            .reduce((acc, curr) => acc + Number(curr.value), 0),
        subscriptions.filter((sub) => sub.interval === SubscriptionInterval.monthly)
            .reduce((acc, curr) => acc + Number(curr.value), 0),
        subscriptions.filter((sub) => sub.interval === SubscriptionInterval.quarterly)
            .reduce((acc, curr) => acc + Number(curr.value), 0),
        subscriptions.filter((sub) => sub.interval === SubscriptionInterval.annual)
            .reduce((acc, curr) => acc + Number(curr.value), 0),
    ];

    const weekly = Math.round(((weeklySum) + (monthlySum / 4) + (quarterlySum / 13) + (annualSum / 52)));
    const monthly = Math.round((weeklySum * 4) + monthlySum + (quarterlySum / 3) + (annualSum / 12));
    const quarterly = Math.round((weeklySum * 13) + (monthlySum * 3) + (quarterlySum) + (annualSum / 4));
    const annual = Math.round((weeklySum * 52) + (monthlySum * 12) + (quarterlySum * 4) + (annualSum));

    const parsedUpcoming = subscriptions.map((s) => ({ ...s, value: Number(s.value) })).slice(0, 4);

    return {
        averages: {
            annual,
            monthly,
            quarterly,
            weekly
        },
        billings: parsedUpcoming,
    }

}

export default generateSubscriptionsForecast;