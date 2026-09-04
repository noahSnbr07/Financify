import { database } from "@/src/configuration";
import { getAuth } from "@/src/server";
import { redirect } from "next/navigation";
import { SubscriptionList } from "./components";
import { Subscription } from "@/src/generated/prisma/client";

export type ParsedSubscription = Omit<Subscription, "value"> & {
    value: number;
    category: {
        name: string;
        color: string;
    };
    account: {
        name: string;
        color: string;
    },
    transactions: {
        value: number;
    }[];
}

async function page() {

    const auth = await getAuth();
    if (!auth) return redirect("/authentication");

    const subscriptions = await database.subscription.findMany({
        where: {
            user: { id: auth.id },
        },
        include: {
            category: {
                select: {
                    name: true,
                    color: true,
                }
            },
            account: {
                select: {
                    name: true,
                    color: true,
                }
            },
            transactions: {
                where: {
                    user: {
                        id: auth.id
                    }
                },
                select: { value: true, }
            }
        },
    });


    const parsed: ParsedSubscription[] =
        subscriptions.map((s) => ({
            ...s,
            value: Number(s.value),
            transactions: s.transactions.map((t) => ({
                value: Number(t.value)
            }))
        }));


    return (
        <>
            <SubscriptionList
                subscriptions={parsed}
            />
        </>
    );
}

export default page;