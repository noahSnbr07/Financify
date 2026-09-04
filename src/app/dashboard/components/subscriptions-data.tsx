"use client";

import { Digits } from "@/src/global/components";
import type { Averages } from "@/src/server/get-dashboard-data";

interface _props {
    averages: Averages;
}

export default function SubscriptionData({ averages }: _props) {


    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col">
                <AverageEntry label="Week" value={averages.weekly} />
                <AverageEntry label="Month" value={averages.monthly} />
                <AverageEntry label="Quarter" value={averages.quarterly} />
                <AverageEntry label="Annual" value={averages.annual} />
            </div>

        </div>
    );
}

function AverageEntry({ label, value }: { label: string; value: number; }) {

    return (
        <div className="grid grid-cols-2 w-full py-2 items-center">
            <p> Average {label}: </p>
            <Digits additionalClassName="font-bold bg-stack p-2 rounded-sm" value={value} />
        </div>
    )
}