'use client';

import { useState } from "react";
import { colors } from "@/src/assets";
import { ColorSelector, StringInput } from "@/utils/form-components";
import { SuccessAction, useFetch } from "@/src/hooks";

export interface NewAccountProps {
    color: string;
    name: string;
}

export default function NewTransactionForm() {

    const [newAccount, setNewAccount] = useState<NewAccountProps>({
        color: colors[0].hsl,
        name: "",
    });

    const { SubmitButton } = useFetch({
        feedback: {
            error: "Account could not be created",
            success: "Account has been created",
        },
        href: "/api/account/create",
        onSuccess: SuccessAction.redirect,
        redirectHref: "/dashboard",
        submitConditions: [
            newAccount.color.length > 0,
            newAccount.name.length > 0,
        ],
        data: newAccount,
    });

    return (
        <div className="flex flex-col gap-4">
            <StringInput
                onChange={(name) => setNewAccount((previous) => ({ ...previous, name }))}
                value={newAccount.name}
                autoFocus
                placeholder="select name ..."
            />
            <ColorSelector
                color={newAccount.color}
                onChange={(color) => setNewAccount((previous) => ({ ...previous, color }))}
            />
            {SubmitButton}
        </div>
    );
}