'use client';

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { CreateSubscriptionType } from "./new-subscription-form";

interface _props {
    subscription: CreateSubscriptionType;
    setSubscription: Dispatch<SetStateAction<CreateSubscriptionType>>;
}

function formatDateForInput(date: Date | string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    const year = parsedDate.getFullYear();
    const month = `${parsedDate.getMonth() + 1}`.padStart(2, "0");
    const day = `${parsedDate.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default function DatePicker({ setSubscription, subscription }: _props) {
    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <b className="text-sm text-foreground/50"> Select Start Date </b>
            <input
                value={formatDateForInput(subscription.startDate)}
                type="date"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setSubscription((previous) => ({
                        ...previous,
                        startDate: new Date(event.target.value),
                    }))
                }
            />
        </div>
    );
}