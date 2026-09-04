'use client';

import { Account } from "@/src/generated/prisma/client";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import FormStateIndicator from "./form-state-indicator";

interface _props {
    onChange: (account: Account) => void;
    account: Account;
    accounts: Account[];
}

export default function AccountSelector({ account, accounts, onChange }: _props) {

    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <FormStateIndicator label="Select Account:" value={account.name} color={account.color} />

            <div className="grid grid-cols-2 gap-4">
                {accounts.map(function (indexedAccount) {
                    return (
                        <button
                            key={indexedAccount.id}
                            type="button"
                            className="rounded-sm p-2 font-bold"
                            style={{
                                border: `4px solid ${indexedAccount.color}`,
                                background: indexedAccount.id === account.id ? `${indexedAccount.color}` : "var(--stack)"
                            }}
                            onClick={() => onChange(indexedAccount)}> {indexedAccount.name} </button>
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