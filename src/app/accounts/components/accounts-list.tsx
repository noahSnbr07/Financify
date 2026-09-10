'use client';

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import { AccountsListAccountTypeParsed } from "../manage/page";
import { SuccessAction, useFetch } from "@/src/hooks";

interface _props {
    accounts: AccountsListAccountTypeParsed[];
}

export default function AccountsList({ accounts }: _props) {


    return (
        <div className="flex flex-col gap-2">
            {accounts.map((account) => <AccountListEntry account={account} key={account.id} />)}
        </div>
    );
}

function AccountListEntry({ account }: { account: AccountsListAccountTypeParsed }) {

    const [collapsed, setCollapsed] = useState<boolean>(false);

    const Icon = collapsed ? <ChevronDownIcon opacity={.5} /> : <ChevronUpIcon opacity={.5} />

    const { SubmitButton } = useFetch({
        buttonClassName: "bg-red-800 p-4 rounded-sm font-bold",
        buttonLabel: "Delete",
        feedback: {
            error: "Account could not be Deleted",
            success: "Account has been deleted."
        },
        href: `/api/account/delete/${account.id}`,
        onSuccess: SuccessAction.refresh,
        submitConditions: [account !== null],
    })

    return (
        <div
            className="bg-stack rounded-lg flex flex-col"
        >
            <button
                onClick={() => setCollapsed(c => !c)}
                className="flex items-center gap-4 p-4 bg-stack rounded-lg">
                {Icon}
                <b> {account.name} </b>
                <div
                    style={{ background: account.color }}
                    className="size-2 rounded-full"></div>
            </button>
            {!collapsed && (
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex flex-col gap-2">
                        <KeyValuePair label={"Balance"} value={account.total} />
                        <KeyValuePair label={"Created"} value={account.created.toLocaleDateString()} />
                    </div>
                    {SubmitButton}
                </div>
            )}
        </div>
    )
}

/*
name: string;
id: string;
created: Date;
updated: Date;
color: string;
userId: string;
t: x[];
*/

interface KeyValuePairProps {
    label: string | number;
    value: string | number;
}

function KeyValuePair({ label, value }: KeyValuePairProps) {

    return (
        <div className="grid grid-cols-2 p-2 bg-stack rounded-sm">
            <p> {label} </p>
            <b> {value} </b>
        </div>
    );
}