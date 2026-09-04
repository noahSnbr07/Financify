'use client';

import { SubscriptionInterval } from "@/src/generated/prisma/enums";
import FormStateIndicator from "./form-state-indicator";

interface _props {
    interval: SubscriptionInterval;
    onChange: (interval: SubscriptionInterval) => void;
}
export default function IntervalSelector({ interval, onChange }: _props) {

    const intervals = [
        SubscriptionInterval.weekly,
        SubscriptionInterval.monthly,
        SubscriptionInterval.quarterly,
        SubscriptionInterval.annual,
    ];

    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <FormStateIndicator label="Select Interval:" value={interval} />
            <div className="grid grid-cols-2 gap-4">
                {intervals.map((indexedInterval) => (
                    <button
                        style={{ border: indexedInterval === interval ? "2px solid var(--foreground)" : "2px solid transparent" }}
                        onClick={() => onChange(indexedInterval)}
                        key={indexedInterval}
                        className="bg-stack p-2 rounded-sm"
                    > {indexedInterval.toUpperCase()} </button>
                ))}
            </div>
        </div>
    );
}