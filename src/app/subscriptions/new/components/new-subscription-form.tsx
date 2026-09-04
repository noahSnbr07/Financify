"use client";

import { SubscriptionInterval } from "@/src/generated/prisma/browser";
import { useState } from "react";
import { Account, Category } from "@/src/generated/prisma/client";
import { Warning } from "@/src/global/components";
import { warnings } from "@/src/static/client";
import { AccountSelector, CategorySelector, DatePicker, IntervalSelector, StringInput, ValuePicker } from "@/utils/form-components";
import { SuccessAction, useFetch } from "@/src/hooks";

interface _props {
    categories: Category[];
    accounts: Account[];
}

export default function NewSubscriptionForm({ categories, accounts }: _props) {

    const now = new Date();

    const [subscription, setSubscription] = useState({
        interval: SubscriptionInterval.monthly as SubscriptionInterval,
        name: "",
        startDate: new Date(),
        value: 0,
        account: { id: "", name: "", created: now, updated: now, userId: "", color: "", },
        category: { id: "", name: "", created: now, updated: now, userId: "", color: "", },
    });

    const { SubmitButton } = useFetch({
        href: "/api/subscription/create",
        feedback: {
            error: "Subscription could not be created",
            success: "Subscription has been created",
        },
        data: {
            interval: subscription.interval,
            name: subscription.name,
            startDate: subscription.startDate,
            value: subscription.value,
            accountId: subscription.account.id,
            categoryId: subscription.category.id,
        },
        onSuccess: SuccessAction.redirect,
        redirectHref: "/dashboard",
        submitConditions: [
            subscription.name.length > 0,
            subscription.value > 0,
            subscription.account.id.length > 0,
            subscription.category.id.length > 0,
        ],
    });

    //name value interval category account date

    return (
        <div className="flex flex-col gap-4">
            {categories.length < 1 && <Warning warning={warnings.NO_CATEGORIES} />}
            {accounts.length < 1 && <Warning warning={warnings.NO_ACCOUNTS} />}

            <StringInput
                onChange={(name) => setSubscription((previous) => ({ ...previous, name }))}
                value={subscription.name ?? ""}
                autoFocus
                placeholder="select name ..."
            />
            <ValuePicker
                onChange={(value) => setSubscription((previous) => ({ ...previous, value }))}
                value={subscription.value}
            />
            <IntervalSelector
                interval={subscription.interval}
                onChange={(interval) => setSubscription((previous) => ({ ...previous, interval }))}
            />
            <CategorySelector
                categories={categories}
                category={subscription.category}
                onChange={(category) => setSubscription((previous) => ({ ...previous, category }))}
            />
            <AccountSelector
                account={subscription.account}
                accounts={accounts}
                onChange={(account) => setSubscription((previous) => ({ ...previous, account }))}
            />
            <DatePicker
                date={subscription.startDate}
                onChange={(startDate) => setSubscription((previous) => ({ ...previous, startDate }))}
            />

            {SubmitButton}
        </div>
    );
}