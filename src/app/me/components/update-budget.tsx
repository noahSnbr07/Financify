'use client';

import { APIResponse } from "@/src/interfaces";
import { SaveAllIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";

interface _props {
    current: number;
}

export default function UpdateBudget({ current }: _props) {

    const [pending, setPending] = useState<boolean>(false);
    const [budget, setBudget] = useState<number>(0);
    const router = useRouter();

    async function updateBudget(): Promise<void> {

        if (pending) return;
        else setPending(true);

        const url: string = "/api/me/budget/update";
        const options: RequestInit = { method: "POST", body: JSON.stringify({ budget: budget }), }

        try {
            const response = await fetch(url, options);
            const data: APIResponse = await response.json();
            if (response.ok && data.success) toast("Budget updated.", { type: "success" });
            else toast(data.message, { type: "error" });

        } catch (error) {
            console.error(error);
            toast("Uncaught Client Error", { type: "error" });
        } finally {
            setPending(false);
            setBudget(budget)
            router.refresh();
        }
    }

    return (
        <div className="flex flex-col gap-2 bg-stack rounded-lg p-4">
            <b className="text-sm text-foreground/50"> Update Your Monthly Budget (current: ${current}) </b>
            <div className="flex gap-2">
                <input
                    value={budget}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => { setBudget(Number(event.target.value)) }}
                    placeholder={`Set Budget ( current: $${current} )`}
                    className="flex-1 active:outline-none py-2 bg-stack rounded-sm px-4"
                    type="number"
                    name="budget"
                    id="budget" />
                <button
                    onClick={updateBudget}
                    className="p-2"
                >
                    <SaveAllIcon size={20} opacity={.5} />
                </button>
            </div>
        </div>
    );
}