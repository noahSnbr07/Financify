'use client';

import { DollarSignIcon } from "lucide-react";

interface _props {
    budgetExceeded: number;
    color: string;
}
export default function BudgetUsed({ budgetExceeded, color }: _props) {


    return (
        <div className="flex px-4 py-0.5 gap-4 bg-stack rounded-full items-center">
            <span
                style={{ color: color }}
                className="flex gap-2 items-center">
                <div
                    style={{ background: color }}
                    className="size-2 rounded-full"></div>
                <b> {budgetExceeded}% </b>
                <p className="text-sm"> Budget Used </p>
            </span>
        </div>
    );
}