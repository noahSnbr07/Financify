'use client';

import { TransactionLink, UniversalTransaction } from "@/utils/universal-components/app-components";

interface _props {
    transactions: UniversalTransaction[];
}
export default function TransactionHistory({ transactions }: _props) {


    return (
        <div className="flex gap-2 flex-col">
            {transactions.slice(transactions.length <= 5 ? 0 : transactions.length - 5).reverse().map(function (transaction) {

                return (
                    <TransactionLink
                        key={transaction.id}
                        universalTransaction={transaction}
                    />
                );
            })}
        </div>
    );
}