'use client';

import { Dispatch, SetStateAction } from "react";
import { CreateSubscriptionType } from "./new-subscription-form";
import { Category } from "@/src/generated/prisma/client";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

interface _props {
    setSubscription: Dispatch<SetStateAction<CreateSubscriptionType>>;
    subscription: CreateSubscriptionType;
    categories: Category[];
}
export default function CategorySelector({ setSubscription, subscription, categories }: _props) {


    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <b className="text-sm text-foreground/50"> Select Category </b>
            <div className="grid grid-cols-2 gap-4">
                {categories.map(function (category) {
                    return (
                        <button
                            key={category.id}
                            type="button"
                            className="rounded-sm p-2 font-bold"
                            style={{ border: `4px solid ${category.color}`, background: subscription.categoryId === category.id ? `${category.color}` : "var(--stack)" }}
                            onClick={() => setSubscription((previous) => ({ ...previous, categoryId: category.id }))}> {category.name} </button>
                    );
                })}
                <Link
                    className="bg-stack rounded-sm flex justify-center p-2 border-foreground/50 border-2"
                    href={"/categories/new"}
                > <PlusIcon opacity={.5} /> </Link>
            </div>
        </div>
    );
}