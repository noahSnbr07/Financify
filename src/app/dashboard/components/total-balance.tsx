'use client';

import { Digits } from "@/src/global/components";

interface TotalBalanceProps {
    balance: number;
}

export default function TotalBalance({ balance }: TotalBalanceProps) {

    return (
        <div className="flex-1 bg-stack grid place-content-center min-h-20 rounded-lg">
            <Digits additionalClassName="font-bold text-4xl" value={Number(balance.toFixed(2))} />
        </div>
    );
}