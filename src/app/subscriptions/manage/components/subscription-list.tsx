'use client';

import { ChevronDown, ChevronUp } from "lucide-react";
import { ParsedSubscription } from "../page";
import { useState } from "react";
import { Digits } from "@/src/global/components";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { APIResponse } from "@/src/interfaces";
import { SubscriptionState } from "@/src/generated/prisma/enums";

interface _props {
    subscriptions: ParsedSubscription[];
}

export default function SubscriptionList({ subscriptions }: _props) {

    return (
        <div className="flex flex-col gap-2 overflow-y-scroll w-full">
            {subscriptions.map((subscription) =>
                <SubscriptionEntry
                    key={subscription.id}
                    subscription={subscription} />)}
        </div>
    );
}

function SubscriptionEntry({ subscription }: { subscription: ParsedSubscription }) {

    const [expanded, setExpanded] = useState<boolean>(false);

    const totalSpending = subscription.transactions.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="flex flex-col bg-stack rounded-lg">
            <button
                className="flex gap-4 p-4 items-center"
                onClick={() => setExpanded((previous) => (!previous))}>
                {expanded ? <ChevronUp opacity={.5} /> : <ChevronDown opacity={.5} />}
                <b> {subscription.name} </b>
            </button>
            {expanded && (
                <div
                    className="p-4 rounded-sm flex flex-col gap-4">
                    <div className="grid grid-cols-2">
                        <div className="flex gap-4 items-center">
                            <div
                                style={{ background: subscription.category.color }}
                                className="size-4 rounded-sm"></div>
                            <p> {subscription.category.name} </p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div
                                style={{ background: subscription.account.color }}
                                className="size-4 rounded-full"></div>
                            <p> {subscription.account.name} </p>
                        </div>
                    </div>
                    <hr className="border-stack rounded-full border-2" />
                    <div className="bg-background p-2 rounded-sm flex">
                        <Digits value={subscription.value} />
                        /
                        <p>  {subscription.interval} </p>
                    </div>
                    <hr className="border-stack rounded-full border-2" />
                    <div className="grid grid-cols-2">
                        <div className="flex flex-col gap-2 justify-center">
                            <p className="text-sm"> Started: </p>
                            <CalendarDate date={subscription.startDate} />
                        </div>
                        <div className="flex flex-col gap-2 justify-center">
                            <p className="text-sm"> Next Billing: </p>
                            <CalendarDate date={subscription.nextBillingDate} />
                        </div>
                    </div>
                    <hr className="border-stack rounded-full border-2" />
                    <div className="flex flex-col gap-2">
                        <b> Billings so far: {subscription.transactions.length} </b>
                        <div className="flex gap-2 items-center">
                            <b>Total Costs:</b>
                            <Digits additionalClassName="font-bold bg-stack px-4 py-0.5 rounded-sm" value={totalSpending} />
                        </div>
                    </div>
                    <hr className="border-stack rounded-full border-2" />
                    <SwitchStateButton subscriptionId={subscription.id} state={subscription.state} />
                </div>
            )}
        </div>
    );
}

function CalendarDate({ date }: { date: Date }) {

    return (
        <div
            className="flex flex-col py-2 w-16 bg-stack h-full justify-center text-center rounded-sm">
            <b> {date.toLocaleDateString("en", { day: "numeric" })} </b>
            <p> {date.toLocaleDateString("en", { month: "short" })} </p>
        </div>
    );
}

function SwitchStateButton({ subscriptionId, state }: { subscriptionId: string; state: SubscriptionState }) {

    const [pending, setPending] = useState<boolean>(false);
    const router = useRouter();

    const endpoint = state === "active" ? "cancel" : "activate";
    const toastVerbPast = state === "active" ? "canceled" : "activated";

    async function cancelSubscription() {
        if (pending) return;
        else setPending(true);

        try {
            const response = await fetch(`/api/subscription/${endpoint}/${subscriptionId}`, { method: "POST" });
            const data: APIResponse = await response.json();
            toast(`Subscription has been ${toastVerbPast}`, { type: "success" });

            if (!response.ok || !data.success) {
                toast(`Subscription could not be ${toastVerbPast}`, { type: "error" });
            }

            router.refresh();

        } catch (error) {
            console.error(error);
            toast(`Subscription could not be ${toastVerbPast}`, { type: "error" });
        } finally {
            setPending(false);
        }
    }

    return (
        <button
            disabled={pending}
            style={{ opacity: pending ? .5 : 1, background: state === "active" ? "var(--color-red-800)" : "var(--color-green-800)" }}
            onClick={cancelSubscription}
            className="rounded-sm font-bold p-4"
        >
            {endpoint} Subscription
        </button>
    );
}