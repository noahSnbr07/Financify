'use client';

import { Digits } from "@/src/global/components";
import BudgetUsed from "./budget-used";

interface TotalBalanceProps {
    balance: number;
    budgetExceeded: number,
    color: string;
}

export default function TotalBalance({ balance, budgetExceeded, color }: TotalBalanceProps) {

    return (
        <div className="flex-1 bg-stack flex justify-center flex-col gap-2 p-4 min-h-20 rounded-lg items-center">
            <Digits additionalClassName="font-bold text-4xl" value={Number(balance.toFixed(2))} />
            <BudgetUsed color={color} budgetExceeded={budgetExceeded} />
        </div>
    );
}