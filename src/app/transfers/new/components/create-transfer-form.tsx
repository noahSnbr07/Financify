'use client';

import { CreateTransferProps } from "@/src/app/api/transfer/create/route";
import { Account } from "@/src/generated/prisma/browser";
import { SuccessAction, useFetch } from "@/src/hooks";
import { AccountSelector, StringInput, ValuePicker } from "@/utils/form-components";
import { useState } from "react";

interface _props {
    accounts: Account[];
}

export default function CreateTransferForm({ accounts }: _props) {

    const [transfer, setTransfer] = useState<CreateTransferProps>({
        destinationAccountId: accounts[0].id,
        name: "",
        originAccountId: accounts[1].id,
        value: 0,
    });

    const [selectedAccounts, setSelectedAccounts] = useState({
        originAccount: accounts[0],
        destinationAccount: accounts[1] ?? accounts[0],
    });

    const { SubmitButton } = useFetch({
        feedback: {
            error: "Failed to create Transfer",
            success: "Transfer created successfully",
        },
        href: "/api/transfer/create",
        onSuccess: SuccessAction.redirect,
        redirectHref: "/dashboard",
        submitConditions: [
            transfer.value > 0,
            transfer.name.length > 1,
            transfer.originAccountId.length > 1,
            transfer.destinationAccountId.length > 1,
            transfer.originAccountId !== transfer.destinationAccountId,
        ],
        buttonLabel: "Create Transfer",
        data: transfer,
    });

    console.table(transfer);

    return (
        <div className="flex flex-col gap-4">
            <ValuePicker
                onChange={(value) => setTransfer((previous) => ({ ...previous, value }))}
                value={transfer.value}
            />
            <StringInput
                onChange={(name) => setTransfer((previous) => ({ ...previous, name }))}
                value={transfer.name}
                placeholder="Transfer name"
            />
            <div className="flex flex-col gap-1">
                <p> Origin Account: </p>
                <AccountSelector
                    account={selectedAccounts.originAccount}
                    accounts={accounts}
                    onChange={(event) => {
                        setSelectedAccounts((previous) => ({ ...previous, originAccount: event }));
                        setTransfer((previous) => ({ ...previous, originAccountId: event.id }));
                    }}
                />
            </div>
            <div className="flex flex-col gap-1">
                <p> Destination Account: </p>
                <AccountSelector
                    account={selectedAccounts.destinationAccount}
                    accounts={accounts}
                    onChange={(event) => {
                        setSelectedAccounts((previous) => ({ ...previous, destinationAccount: event }));
                        setTransfer((previous) => ({ ...previous, destinationAccountId: event.id }));
                    }}
                />

            </div>
            {SubmitButton}
        </div>
    );
}