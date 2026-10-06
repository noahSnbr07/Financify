"use client";

import { Account, Category, Transaction } from "@/src/generated/prisma/browser";
import { Digits } from "@/src/global/components";
import { SuccessAction, useFetch } from "@/src/hooks";
import { BookmarkCheckIcon, ChevronDownIcon, ChevronUpIcon, CoinsIcon, ListChecksIcon, TagIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type AdditionalTags = { category: Pick<Category, "color" | "name" | "id"> } & { account: Pick<Account, "color" | "name" | "id"> };

type UniversalTransaction = Omit<Transaction, "value"> & { value: number } & AdditionalTags;

function TransactionLink({ universalTransaction, options = false }: { universalTransaction: UniversalTransaction, options?: boolean }) {

    return (
        <div
            className="flex flex-col p-4 gap-4 bg-stack rounded-lg">
            <div className="flex justify-between">
                <div className="flex-col flex gap-4">
                    <Link
                        href={`/transactions/${universalTransaction.id}`}
                        className="text-lg"> {universalTransaction.name} </Link>
                    <div className="flex gap-2">
                        <AdditionalLinkPill
                            label={universalTransaction.account.name}
                            accent={universalTransaction.account.color}
                            type="account"
                        />
                        <AdditionalLinkPill
                            label={universalTransaction.category.name}
                            accent={universalTransaction.category.color}
                            type="account"
                        />

                        <AdditionalLinkPill
                            label={universalTransaction.type === "manual" ? "Manual" : "Billing"}
                            accent={"transparent"}
                            type={universalTransaction.type === "manual" ? "manual" : "billing"}
                        />
                    </div>
                    <p className="text-foreground/50">
                        {universalTransaction.created.toLocaleString()}
                    </p>
                </div>
                <div className="bg-background px-2 py-1 h-min w-1/4 grid place-content-center font-bold text-lg rounded-sm">
                    <Digits value={Number(universalTransaction.value)} />
                </div>
            </div>
            {options && <TransactionLinkExpandableOptions universalTransaction={universalTransaction} />}
        </div>
    );
}

function TransactionLinkExpandableOptions({ universalTransaction }: { universalTransaction: UniversalTransaction }) {

    const [expanded, setExpanded] = useState<boolean>(false);

    const { SubmitButton } = useFetch({
        feedback: {
            error: "Failed to delete Transaction",
            success: "Transaction deleted successfully",
        },
        method: "DELETE",
        href: `/api/transaction/delete/${universalTransaction.id}`,
        onSuccess: SuccessAction.refresh,
        submitConditions: [universalTransaction !== null],
        buttonLabel: "Delete",
        buttonClassName: "p-2 bg-red-800 rounded-sm text-lg font-bold",
    })

    const Icon = expanded ? <ChevronUpIcon opacity={.5} /> : <ChevronDownIcon opacity={.5} />

    return (
        <div className="flex flex-col gap-4 p-2 bg-stack rounded-sm">
            <button
                onClick={() => setExpanded(e => !e)}
                className="bg-background w-full flex gap-2 justify-center p-2">
                {Icon}
                <b> {expanded ? "Collapse" : "Expand"} </b>
            </button>
            {expanded && (
                <div className="flex p-2 gap-2 flex-col">

                    {SubmitButton}
                </div>
            )}
        </div>
    );
}

function CategoryLink() {

    return (
        <Link href={""}>

        </Link>
    );
}

function AccountLink() {

    return (
        <Link href={""}>

        </Link>
    );
}

function SubscriptionLink() {

    return (
        <Link href={""}>

        </Link>
    );
}

type AdditionalLinkPillProps = {
    label: string;
    accent: string;
    type: "account" | "category" | "billing" | "manual";
}

function AdditionalLinkPill({ label, type, accent }: AdditionalLinkPillProps) {

    const Icon = type === "account" ? <BookmarkCheckIcon opacity={.5} size={16} /> :
        type === "category" ? <TagIcon size={16} opacity={.5} /> :
            type === "billing" ? <ListChecksIcon size={16} opacity={.5} /> :
                type === "manual" ? <CoinsIcon size={16} opacity={.5} /> :
                    <></>

    return (
        <div
            style={{ border: `2px solid ${accent}` }}
            className="px-2 py-1 flex gap-2 rounded-full bg-stack items-center">
            {Icon}
            <p className="text-sm text-foreground/50"> {label} </p>
        </div>
    )
}

export {
    AccountLink,
    CategoryLink,
    SubscriptionLink,
    TransactionLink,
    type UniversalTransaction
}