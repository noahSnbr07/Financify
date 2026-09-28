'use client';

import { TransactionLink, UniversalTransaction } from "@/utils/universal-components/app-components";
import Link from "next/link";

interface _props {
    transactions: UniversalTransaction[];
}

export default function ManageTransactions({ transactions }: _props) {

    return (
        <div className="flex flex-col gap-4">
            <div className="overflow-y-scroll">
                <NewDateAnnouncer created={transactions.length > 0 ? transactions[0].created : new Date()} />
                <div className="flex flex-col gap-2">
                    {transactions.map(function (transaction, index) {
                        const newDate: boolean = (!(index <= 0) && transaction.created.getDay() !== transactions[index - 1].created.getDay());

                        return (
                            <div
                                key={transaction.id}
                                className="flex flex-col gap-1">
                                {newDate && <NewDateAnnouncer created={transaction.created} />}
                                <TransactionLink
                                    options
                                    universalTransaction={transaction}
                                    key={transaction.id}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <DashboardLink />
        </div>
    );
}

function DashboardLink() {

    return (
        <Link
            href={"/dashboard"}
            className="w-full bg-stack text-center p-4 font-bold rounded-sm"
            title="Dashboard Link">
            Go Back To Dashboard
        </Link>
    );
}

function NewDateAnnouncer({ created }: { created: Date }) {

    return (
        <div className="flex gap-4 mt-2 items-center">
            <hr className="border-stack border-2 rounded-full flex-1" />
            <p className="font-bold text-foreground/50"> {created.toLocaleDateString()} </p>
            <hr className="border-stack border-2 rounded-full flex-1" />
        </div>
    );
}