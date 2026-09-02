'use client';

import { Dispatch, SetStateAction } from "react";
import { CreateSubscriptionType } from "./new-subscription-form";
import { Account } from "@/src/generated/prisma/client";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

interface _props {
    setSubscription: Dispatch<SetStateAction<CreateSubscriptionType>>;
    subscription: CreateSubscriptionType;
    accounts: Account[];
}
export default function AccountSelector({ setSubscription, subscription, accounts }: _props) {

    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <b className="text-sm text-foreground/50"> Select Account </b>
            <div className="grid grid-cols-2 gap-4">
                {accounts.map(function (account) {
                    return (
                        <button
                            key={account.id}
                            type="button"
                            className="rounded-sm p-2 font-bold"
                            style={{ border: `4px solid ${account.color}`, background: subscription.accountId === account.id ? `${account.color}` : "var(--stack)" }}
                            onClick={() => setSubscription((previous) => ({ ...previous, accountId: account.id }))}> {account.name} </button>
                    );
                })}
                <Link
                    className="bg-stack rounded-sm flex justify-center p-2 border-foreground/50 border-2"
                    href={"/accounts/new"}
                > <PlusIcon opacity={.5} /> </Link>
            </div>
        </div>
    );
}