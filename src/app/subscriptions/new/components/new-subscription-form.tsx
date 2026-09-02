"use client";

import { Subscription, SubscriptionInterval } from "@/src/generated/prisma/browser";
import { APIResponse } from "@/src/interfaces";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import NameInput from "./name-input";
import DatePicker from "./date-picker";
import ValuePicker from "./value-picker";
import IntervalSelector from "./interval-selector";
import { Account, Category } from "@/src/generated/prisma/client";
import { Warning } from "@/src/global/components";
import { warnings } from "@/src/static/client";
import CategorySelector from "./category-selector";
import AccountSelector from "./account-selector";

export type CreateSubscriptionType = Pick<Subscription,
    "interval" |
    "name" |
    "accountId" |
    "categoryId" |
    "startDate"> & {
        value: number;
    };

interface _props {
    categories: Category[];
    accounts: Account[];
}

export default function NewSubscriptionForm({ categories, accounts }: _props) {

    const [subscription, setSubscription] = useState<CreateSubscriptionType>({
        interval: SubscriptionInterval.monthly,
        name: "",
        startDate: new Date(),
        value: 0,
        accountId: "",
        categoryId: "",
    });

    const [pending, setPending] = useState<boolean>(false);
    const router = useRouter();

    const invalidForm = () => Boolean(
        subscription.value === 0 ||
        subscription.name.length < 1 ||
        subscription.startDate.toLocaleDateString().length < 1 ||
        categories.length < 1 ||
        accounts.length < 1
    )

    async function submitForm() {
        console.log(pending)
        if (pending) return;
        else setPending(true);

        try {

            if (invalidForm()) return toast("Form data invalid.")

            const response = await fetch("/api/subscription/create", { method: "POST", body: JSON.stringify({ ...subscription, startDate: new Date() }) });
            const data: APIResponse = await response.json();

            toast(data.message, { type: (!response.ok || !data.success) ? "error" : "success" });


            router.push("/dashboard");

        } catch (error) {
            console.error(error);
            if (error instanceof Error) toast(error.message, { type: "error" });
            toast("Subscription could not be created", { type: "error" });
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {categories.length < 1 && <Warning warning={warnings.NO_CATEGORIES} />}
            {accounts.length < 1 && <Warning warning={warnings.NO_ACCOUNTS} />}

            <NameInput
                setSubscription={setSubscription}
                subscription={subscription}
            />
            <ValuePicker
                setSubscription={setSubscription}
                subscription={subscription}
            />
            <IntervalSelector
                setSubscription={setSubscription}
                subscription={subscription}
            />
            <CategorySelector
                categories={categories}
                setSubscription={setSubscription}
                subscription={subscription}
            />
            <AccountSelector
                accounts={accounts}
                setSubscription={setSubscription}
                subscription={subscription}
            />
            <DatePicker
                setSubscription={setSubscription}
                subscription={subscription}
            />
            <button
                onClick={submitForm}
                disabled={invalidForm()}
                style={{ opacity: (invalidForm()) ? .5 : 1 }}
                className="w-full rounded-lg border-2 border-foreground flex justify-center items-center text-lg font-bold p-4"
            > Submit </button>
        </div>
    );
}