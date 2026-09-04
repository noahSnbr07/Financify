'use client';

import { Dispatch, SetStateAction } from "react";
import { CreateSubscriptionType } from "./new-subscription-form";
import { SubscriptionInterval } from "@/src/generated/prisma/enums";

interface _props {
    setSubscription: Dispatch<SetStateAction<CreateSubscriptionType>>;
    subscription: CreateSubscriptionType;
}
export default function IntervalSelector({ setSubscription, subscription }: _props) {

    const intervals = [
        SubscriptionInterval.weekly,
        SubscriptionInterval.monthly,
        SubscriptionInterval.quarterly,
        SubscriptionInterval.annual,
    ];

    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <b className="text-sm"> Select Interval </b>
            <div className="grid grid-cols-2 gap-4">
                {intervals.map((interval) => (
                    <button
                        style={{ border: subscription.interval === interval ? "2px solid var(--foreground)" : "2px solid transparent" }}
                        onClick={() => setSubscription((previous) => ({ ...previous, interval }))}
                        key={interval}
                        className="bg-stack p-2 rounded-sm"
                    > {interval.toUpperCase()} </button>
                ))}
            </div>
        </div>
    );
}