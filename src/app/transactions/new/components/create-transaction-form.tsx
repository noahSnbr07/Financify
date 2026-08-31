'use client';

import { Account, Category } from "@/src/generated/prisma/client";
import { Warning } from "@/src/global/components";
import { warnings } from "@/src/static/client";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, CSSProperties, FormEvent, useState } from "react";
import { toast } from "react-toastify";

interface CreateTransactionShape {
    value: number;
    name: string;
    category: string;
    account: string;
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
        category: "",
        account: "",
        spent: true,
    });

    const [pending, setPending] = useState<boolean>(false);
    const router = useRouter();

    const buttonBlocked = Boolean(pending || accounts.length < 1 || categories.length < 1);

    async function submitForm(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (pending) return;

        if (
            transaction.name.length < 1 ||
            transaction.category.length < 1 ||
            transaction.account.length < 1 ||
            transaction.value === 0
        ) return toast("Invalid form data.", { type: "error" });

        else setPending(true);
        try {

            await fetch("/api/transaction/create", { method: "POST", body: JSON.stringify(transaction) });
            toast("Transaction created successfully", { type: "success" });

        } catch (error) {
            console.error(error);
            toast("Transaction could not be generated", { type: "error" });
        } finally {
            setPending(false);
            router.push("/dashboard")
        }
    }

    const [selectedAccount, setSelectedAccount] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    function selectAccount(id: string) {
        if (id === selectedAccount) return;
        else setSelectedAccount(id);
        setTransaction((previousTransaction) => ({ ...previousTransaction, account: id }));
    }

    function selectCategory(id: string) {
        if (id === selectedCategory) return;
        else setSelectedCategory(id);
        setTransaction((previousTransaction) => ({ ...previousTransaction, category: id }));
    }

    return (
        <form
            className="h-full flex flex-1 flex-col gap-4"
            onSubmit={function (event) { submitForm(event) }}
        >

            {categories.length < 1 && <Warning warning={warnings.NO_CATEGORIES} />}
            {accounts.length < 1 && <Warning warning={warnings.NO_ACCOUNTS} />}

            <input
                autoFocus
                className="bg-stack text-center p-4 text-3xl font-bold rounded-lg"
                type="number"
                name="name"
                id="name"
                placeholder="name"
                value={transaction.value}
                onChange={function (event: ChangeEvent<HTMLInputElement>) { setTransaction((previousTransaction) => ({ ...previousTransaction, value: Number(event.target.value) })) }}
            />

            <input
                className="bg-stack px-4 py-2 rounded-lg"
                type="text"
                name="name"
                id="name"
                placeholder="name"
                value={transaction.name}
                onChange={function (event: ChangeEvent<HTMLInputElement>) { setTransaction((previousTransaction) => ({ ...previousTransaction, name: event.target.value })) }}
            />


            <TransferDirectionToggler updateTransaction={setTransaction} spent={transaction.spent} />

            <div className="flex flex-col gap-2 bg-stack rounded-lg px-4 py-2">
                <i className="text-sm text-foreground/50"> Pick The Associated Account</i>
                <div className="grid grid-cols-2 gap-2 overflow-x-auto w-full whitespace-nowrap">
                    {accounts.map(function (account) {
                        return (
                            <button
                                onClick={() => selectAccount(account.id)}
                                style={{ border: `2px solid ${selectedAccount === account.id ? "var(--color-foreground)" : "transparent"}` }}
                                key={account.id}
                                type="button"
                                className="py-2 rounded-sm bg-stack px-8 border-2 font-bold border-stack">
                                {account.name}
                            </button>
                        );
                    })}
                    <Link
                        className="bg-stack rounded-sm flex justify-center p-2 border-foreground/50 border-2"
                        href={"/accounts/new"}
                    > <PlusIcon opacity={.5} /> </Link>
                </div>
            </div>


            <div className="flex flex-col gap-2 px-4 py-2 bg-stack rounded-lg max-h-96">
                <i className="text-sm text-foreground/50"> Pick Associated Category</i>
                <div className="flex-1 grid grid-cols-2 min-h-0 gap-2 overflow-y-auto">
                    {categories.map(function (category) {
                        return (
                            <button
                                key={category.id}
                                type="button"
                                className="rounded-sm p-2 font-bold"
                                style={{ border: `4px solid ${category.color}`, background: selectedCategory === category.id ? `${category.color}` : "var(--stack)" }}
                                onClick={() => selectCategory(category.id)}> {category.name} </button>
                        );
                    })}
                    <Link
                        className="bg-stack rounded-sm flex justify-center p-2 border-foreground/50 border-2"
                        href={"/categories/new"}
                    > <PlusIcon opacity={.5} /> </Link>
                </div>
            </div>

            <button
                disabled={buttonBlocked}
                style={{ opacity: buttonBlocked ? .5 : 1 }}
                className="border-4 text-xl border-foreground rounded-lg p-4 font-bold"
                type="submit"> Submit </button>
            <Link
                href={"/dashboard"}
                className="text-center underline text-foreground/50">
                Aboard
            </Link>
        </form>
    );

}

interface TransferDirectionTogglerProps {
    spent: boolean;
    updateTransaction: (value: (previous: CreateTransactionShape) => CreateTransactionShape) => void;
}

function TransferDirectionToggler({ spent, updateTransaction }: TransferDirectionTogglerProps) {

    const baseClassName: string = "flex-1 border-2 border-foreground/50 rounded-md py-2 font-bold";

    function updateTransactionTransferDirection(value: boolean): void {
        updateTransaction((previous: CreateTransactionShape) => ({ ...previous, spent: value }));
    }

    const styles: { active: CSSProperties, inactive: CSSProperties, } = {
        active: { background: "var(--color-foreground)", color: "var(--color-background)" },
        inactive: { background: "var(--color-background)", color: "var(--color-foreground)" },
    }

    return (
        <div className="flex p-2 gap-2 bg-stack rounded-lg">
            <button
                style={spent ? styles.active : styles.inactive}
                className={baseClassName} type="button" onClick={() => updateTransactionTransferDirection(true)} > Spent </button>
            <button
                style={!spent ? styles.active : styles.inactive}
                className={baseClassName} type="button" onClick={() => updateTransactionTransferDirection(false)} > Received </button>
        </div>
    );
}