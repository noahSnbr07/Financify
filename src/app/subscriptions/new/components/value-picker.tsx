'use client';

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { CreateSubscriptionType } from "./new-subscription-form";

interface _props {
    subscription: CreateSubscriptionType;
    setSubscription: Dispatch<SetStateAction<CreateSubscriptionType>>;
}
export default function ValuePicker({ setSubscription, subscription }: _props) {


    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <b className="text-sm text-foreground/50"> Select Value </b>
            <input
                value={subscription.value}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setSubscription((previous) => ({ ...previous, value: Number(event.target.value) }))}
                className="w-full p-4 bg-stack rounded-sm text-center text-3xl font-bold"
                type="number" />
        </div>
    );
}