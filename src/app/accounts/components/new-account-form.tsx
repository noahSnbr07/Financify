'use client';

import { useState } from "react";
import ColorPicker from "./color-picker";
import NameInput from "./name-input";
import { APIResponse } from "@/src/interfaces";
import { useRouter } from "next/navigation";
import { MessageCircleWarningIcon } from "lucide-react";
import { colors } from "@/src/assets";

export interface NewAccountProps {
    color: string;
    name: string;
}

export default function NewTransactionForm() {

    const [newAccount, setNewAccount] = useState<NewAccountProps>({
        color: colors[0].hsl,
        name: "",
    });

    const [pending, setPending] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const router = useRouter();

    async function submitForm() {
        if (pending) return;
        else setPending(true);

        try {
            const response = await fetch("/api/account/create", { method: "POST", body: JSON.stringify(newAccount) });
            const data: APIResponse<null> = await response.json();

            if (!response.ok || !data.success) setMessage("Client Error Occurred");

            router.push("/dashboard");

        } catch (error) {
            console.error(error);
            setMessage("An unexpected Error Occurred");
        } finally {
            setPending(false);
        }
    }

    return (
        <>
            <NameInput
                setNewAccount={setNewAccount}
            />
            <ColorPicker
                newAccount={newAccount}
                setNewAccount={setNewAccount} />
            <button
                style={{ opacity: pending ? .5 : 1 }}
                disabled={pending}
                onClick={submitForm}
                className="text-xl border-4 rounded-lg p-4 font-bold border-foreground"
            >
                Create New Account
            </button>
            <ResponseBox
                message={message}
                pending={pending}
                show={message.length > 0}
            />
        </>
    );
}

function ResponseBox({ show, message, pending }: { show: boolean; message: string; pending: boolean; }) {

    if (!show || message.length <= 0) return;

    return (
        <div className="p-2 w-full rounded-sm bg-yellow-500/25 items-center border-yellow-500 border-2 flex gap-2">
            <MessageCircleWarningIcon color="yellow" size={20} />
            <i> {!pending ? message : "Pending Request ..."} </i>
        </div>
    )
}