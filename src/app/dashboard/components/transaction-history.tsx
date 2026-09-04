'use client';

import { Digits } from "@/src/global/components";
import type { ParsedTransaction } from "@/src/server/get-dashboard-data";

interface _props {
    transactions: ParsedTransaction[];
}
export default function TransactionHistory({ transactions }: _props) {


    return (
        <div className="flex flex-col">
            {transactions.slice(transactions.length <= 5 ? 0 : transactions.length - 5).reverse().map(function (transaction) {
                return (
                    <div
                        key={transaction.id}
                        className="flex justify-between gap-2 border-y last:border-b-0 items-center first:border-t-0 border-stack p-2">
                        <div className="flex flex-col">
                            <div className="flex gap-2 items-center">
                                <div className="bg-foreground/50 items-center text-background px-2 py-0 rounded-full text-sm w-min"> {transaction.type === "manual" ? "Manual" : "Billing"} </div>
                                <p> {transaction.name} </p>
                            </div>
                            <p className="text-sm text-foreground/50"> {transaction.account.name} {"·"} {transaction.category.name} </p>
                        </div>
                        <b
                            className="w-20 text-center h-min rounded-full border-2"
                            style={{ borderColor: !transaction.received ? "#bf2f2f" : "#3bbf2f" }}>
                            <Digits value={transaction.value.toFixed(2)} />
                        </b>
                    </div>
                )
            })}
        </div>
    );
}