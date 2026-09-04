'use client';

import { Account, Category } from "@/src/generated/prisma/client";
import { Warning } from "@/src/global/components";
import { SuccessAction, useFetch } from "@/src/hooks";
import { warnings } from "@/src/static/client";
import { AccountSelector, CategorySelector, InOutSwitch, StringInput, ValuePicker } from "@/utils/form-components";
import Link from "next/link";
import { useState } from "react";

interface CreateTransactionShape {
    value: number;
    name: string;
    category: Category;
    account: Account;
    spent: boolean;
}

interface CreateTransactionFormProps {
    categories: Category[];
    accounts: Account[];
}

export default function CreateTransactionForm({ accounts, categories }: CreateTransactionFormProps) {

    const [transaction, setTransaction] = useState<CreateTransactionShape>({
        value: 0,
        name: "",
        category: { color: "", created: new Date(), id: "", name: "", userId: "", updated: new Date() },
        account: { color: "", created: new Date(), id: "", name: "", userId: "", updated: new Date() },
        spent: true,
    });

    const { SubmitButton } = useFetch({
        submitConditions: [
            transaction.value > 0,
            transaction.name.length > 0,
            transaction.category.id.length > 0,
            transaction.account.id.length > 0,
        ],
        href: "/api/transaction/create",
        feedback: {
            error: "Transaction could not be created",
            success: "Transaction has been created",
        },
        data: {
            ...transaction,
            accountId: transaction.account.id,
            categoryId: transaction.category.id,
        },
        onSuccess: SuccessAction.redirect,
        redirectHref: "/dashboard",
    });

    return (
        <div className="flex flex-col gap-4">
            {categories.length < 1 && <Warning warning={warnings.NO_CATEGORIES} />}
            {accounts.length < 1 && <Warning warning={warnings.NO_ACCOUNTS} />}
            <ValuePicker
                onChange={(value) => setTransaction({ ...transaction, value })}
                value={transaction.value}
            />
            <StringInput
                onChange={(name) => setTransaction({ ...transaction, name })}
                value={transaction.name}
                placeholder="select name ..."
            />
            <InOutSwitch
                out={transaction.spent}
                onChange={(out) => setTransaction({ ...transaction, spent: out })}
            />
            <AccountSelector
                account={transaction.account}
                accounts={accounts}
                onChange={(account) => setTransaction({ ...transaction, account })}
            />
            <CategorySelector
                categories={categories}
                category={transaction.category}
                onChange={(category) => setTransaction({ ...transaction, category })}
            />
            {SubmitButton}
            <Link
                href={"/dashboard"}
                className="text-center underline text-foreground/50">
                Aboard
            </Link>
        </div>
    );

}