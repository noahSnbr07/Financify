'use client';

import { TransactionType } from "@/src/generated/prisma/enums";
import Digits from "@/src/global/components/client/digits";
import { APIResponse } from "@/src/interfaces";
import { TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface _props {
    transactions: {
        category: {
            name: string;
        };
        type: TransactionType;
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
                <NewDateAnnouncer created={transactions.length > 0 ? transactions[0].created : new Date()} />
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
                                    className="flex gap-4 items-center flex-1"
                                >
                                    <CalendarDate
                                        received={transaction.received}
                                        created={transaction.created} />
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-foreground/50 items-center text-background px-2 py-0 rounded-full text-sm w-min"> {transaction.type === "manual" ? "Manual" : "Billing"} </div>
                                            <b> {transaction.name} </b>
                                        </div>
                                        <i className="text-sm truncate"> {transaction.category.name} </i>
                                    </div>
                                </div>
                                <div className="w-full max-w-1/3 flex gap-4 bg-stack rounded-sm justify-end items-center p-2">
                                    <b className="text-lg"> <Digits value={transaction.value} /> </b>
                                    <DeleteButton transactionId={transaction.id} />
                                </div>
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

function DeleteButton({ transactionId }: { transactionId: string; }) {

    const [pending, setPending] = useState<boolean>(false);
    const router = useRouter();

    async function deleteTransaction() {
        if (pending) return;
        else setPending(true);

        try {

            const url: string = `/api/transaction/delete/${transactionId}`;
            const options: RequestInit = { method: "POST", }

            const response = await fetch(url, options);
            if (!response.ok) toast("Uncaught client error.", { type: "error" });

            const data: APIResponse = await response.json();
            if (!data.success || data.status !== 200) toast(data.message, { type: "error" });

            toast(data.message, { type: "success" });

        } catch (error) {
            console.error(error);
        } finally {
            setPending(false);
            router.refresh();
        }
    }

    return (
        <button
            onClick={deleteTransaction}
            disabled={pending}
            style={{ opacity: pending ? .5 : 1 }}
            className="bg-red-800 p-2 rounded-sm"> <TrashIcon /> </button>
    )
}