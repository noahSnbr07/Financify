'use client';

import { Digits } from "@/src/global/components";
import type { Billing } from "@/src/server/get-dashboard-data";

interface _props {
    billings: Billing[];
}
export default function UpComingBillings({ billings }: _props) {

    return (
        <div className="grid grid-cols-2 gap-4">
            {billings.map((subscription, _index: number) => (
                <div
                    key={_index}
                    className="flex gap-4 bg-stack rounded-lg flex-col p-4">
                    <div className="flex gap-2">
                        <div
                            style={{ background: subscription.account.color }}
                            className="px-3 text-sm truncate rounded-full bg-foreground/20"> {subscription.category.name} </div>
                        <div
                            style={{ background: subscription.account.color }}
                            className="px-3 text-sm truncate rounded-full bg-foreground/20"> {subscription.account.name} </div>
                    </div>
                    <div className="bg-background p-2 grid grid-cols-2 items-center">
                        <CalendarDate date={subscription.nextBillingDate} />
                        <b> {subscription.nextBillingDate.getFullYear()} </b>
                    </div>
                    <div className="flex gap-2">
                        <Digits additionalClassName="font-bold" value={subscription.value} />
                        <p> / </p>
                        {subscription.interval}
                    </div>
                </div>
            ))}
        </div>
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