'use client';

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { CreateSubscriptionType } from "./new-subscription-form";

interface _props {
    setSubscription: Dispatch<SetStateAction<CreateSubscriptionType>>;
    subscription: CreateSubscriptionType;
}

export default function NameInput({ setSubscription, subscription }: _props) {


    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <b className="text-foreground/50 text-bold text-sm"> Select Name </b>
            <input
                value={subscription.name}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setSubscription((previous) => ({ ...previous, name: event.target.value }))}
                autoFocus
                className="bg-stack p-4 rounded-sm"
                placeholder="name ..."
                type="text" />
        </div>
    );
}