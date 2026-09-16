'use client';

import { Digits } from "@/src/global/components";
import type { Billing } from "@/src/server/get-dashboard-data";

interface _props {
    billings: Billing[];
}
export default function UpComingBillings({ billings }: _props) {

    return (
        <div className="flex flex-col gap-4">
            {billings.map((subscription, _index: number) => (
                <div
                    key={_index}
                    className="flex gap-4 bg-stack rounded-lg p-2 flex-col">
                    <div className="flex gap-4">
                        <ColoredPill color={subscription.category.color} label="Category" value={subscription.category.name} />
                        <ColoredPill color={subscription.account.color} label="Account" value={subscription.account.name} />
                    </div>
                    <div className="flex gap-4">
                        <CalendarDate date={subscription.nextBillingDate} />
                        <div className="flex flex-1 p-2 flex-col bg-stack rounded-sm">
                            <b> {subscription.name} </b>
                            <div className="flex gap-2">
                                <Digits additionalClassName="font-bold" value={subscription.value} />
                            </div>
                        </div>
                    </div>
                </div >
            ))
            }
        </div >
    );
}

function CalendarDate({ date }: { date: Date }) {

    return (
        <div
            className="flex flex-col py-2 w-16 bg-stack h-full justify-center text-center rounded-sm">
            <b> {date.toLocaleDateString("en", { day: "numeric" })} </b>
            <p> {date.toLocaleDateString("en", { month: "short" })} </p>
        </div>
    );
}

function ColoredPill({ label, color, value }: { label: string; color: string; value: string }) {

    return (
        <div className="flex gap-2">
            <p> {label}: </p>
            <div
                style={{ background: color }}
                className="px-3 text-sm truncate rounded-full bg-foreground/20"> {value} </div>
        </div>
    );
}