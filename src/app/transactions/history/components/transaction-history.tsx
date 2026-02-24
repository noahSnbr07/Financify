'use client';

import Link from "next/link";

interface _props {
    transactions: {
        category: {
            name: string;
        };
        value: number;
        id: string;
        created: Date;
        updated: Date;
        name: string;
        received: boolean;
        accountId: string;
        userId: string;
        categoryId: string;
    }[];
}

export default function TransactionHistory({ transactions }: _props) {

    return (
        <div className="flex flex-col gap-4">
            <div className="overflow-y-scroll">
                <NewDateAnnouncer created={transactions[0].created} />
                {transactions.map(function (transaction, index) {
                    const newDate: boolean = (!(index <= 0) && transaction.created.getDay() !== transactions[index - 1].created.getDay());

                    return (
                        <div
                            key={transaction.id}
                            className="flex flex-col gap-1">
                            {newDate && <NewDateAnnouncer created={transaction.created} />}
                            <div
                                className="flex items-center justify-between">
                                <div
                                    className="flex gap-4 items-center"
                                >
                                    <CalendarDate
                                        received={transaction.received}
                                        created={transaction.created} />
                                    <div className="flex flex-col gap-1">
                                        <b> {transaction.name} </b>
                                        <i className="text-sm"> {transaction.category.name} </i>
                                    </div>
                                </div>
                                <b className="bg-stack p-2 rounded-sm w-1/3 text-end text-lg"> ${transaction.value} </b>
                            </div>
                        </div>
                    );
                })}
            </div>
            <DashboardLink />
        </div>
    );
}

function CalendarDate({ created, received }: { created: Date, received: boolean }) {

    return (
        <div
            style={{ borderLeft: `8px solid ${received ? "rgba(0, 255, 0, .5" : "rgba(255, 0, 0, .5"}` }}
            className="flex flex-col py-2 w-16 bg-stack h-full justify-center text-center">
            <b> {created.toLocaleDateString("en", { day: "numeric" })} </b>
            <p> {created.toLocaleDateString("en", { month: "short" })} </p>
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