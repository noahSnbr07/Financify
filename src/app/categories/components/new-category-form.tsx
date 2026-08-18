'use client';

import { colors } from "@/src/assets";
import { useState } from "react";
import NameInput from "./name-input";
import ColorPicker from "./color-picker";
import { useRouter } from "next/navigation";
import { APIResponse } from "@/src/interfaces";
import { MessageCircleWarningIcon } from "lucide-react";

export interface NewCategoryProps {
    name: string;
    color: string;
}

export default function NewCategoryForm() {

    const [newCategory, setNewCategory] = useState<NewCategoryProps>({
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
            const response = await fetch("/api/category/create", { method: "POST", body: JSON.stringify(newCategory) });
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
            <NameInput setNewCategory={setNewCategory} />
            <ColorPicker
                newCategory={newCategory}
                setNewCategory={setNewCategory}
            />
            <button
                style={{ opacity: pending ? .5 : 1 }}
                disabled={pending}
                onClick={submitForm}
                className="text-xl border-4 rounded-lg p-4 font-bold border-foreground"
            >
                Create New Category
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