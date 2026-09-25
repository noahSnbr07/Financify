'use client';

import { Digits } from "@/src/global/components";
import type { Billing } from "@/src/server/get-dashboard-data";
import { ClockFadingIcon, CoinsIcon, TagIcon } from "lucide-react";

interface _props {
    billings: Billing[];
}
export default function UpComingBillings({ billings }: _props) {

    return (
        <div className="grid grid-cols-2 gap-4">
            {billings.map((subscription, _index: number) => (
                <div
                    key={_index}
                    className="bg-stack rounded-lg p-4 flex flex-col gap-2">
                    <b className="text-lg"> {subscription.name} </b>
                    <div className="flex gap-2">
                        <ColoredPill icon={<TagIcon size={16} opacity={.5} />} color={subscription.category.color} value="a" />
                        <ColoredPill icon={<CoinsIcon size={16} opacity={.5} />} color={subscription.account.color} value="a" />
                    </div>
                    <div className="bg-background py-4 px-2 rounded-sm">
                        <b className="text-xl text-center">
                            <Digits value={subscription.value} />
                        </b>
                    </div>
                    <div className="flex justify-between text-sm">
                        <p> Due: {subscription.nextBillingDate.toLocaleDateString(undefined, { day: "2-digit", month: "short" })} </p>
                        <p className="text-foreground/50 flex gap-2 items-center">
                            <ClockFadingIcon opacity={.5} size={16} /> {subscription.interval}
                        </p>
                    </div>
                </div>
            ))
            }
        </div >
    );
}


function ColoredPill({ color, value, icon }: { color: string; value: string; icon: React.JSX.Element }) {

    return (
        <div
            style={{ background: color }}
            className="px-2 py-0.5 rounded-full">
            <div className="flex gap-2 items-center">
                {icon}
                <p className="text-sm"> {value} </p>
            </div>
        </div>
    );
}