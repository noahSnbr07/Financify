'use client';

import { APIResponse } from "@/src/interfaces";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";


export default function WipeDataButton() {

    const [visible, setVisible] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);

    const router = useRouter();

    async function wipeUserData() {
        if (pending) return;

        try {

            const url: string = "/api/authentication/reset";
            const options: RequestInit = { method: "POST", }
            const response = await fetch(url, options);
            const data: APIResponse = await response.json();

            if (!response.ok || !data.success || data.status !== 200) throw new Error("Unexpected Server Error");

            toast("Data wiped successfully", { type: "success" });

        } catch (error) {
            if (error instanceof Error) throw new Error(error.message)
            toast("Data could not be wiped", { type: "error" });
        } finally {
            setPending(false);
            setVisible(false);
            router.refresh();
        }

        console.log("wiping");
    }

    return (
        <>
            {visible && (<div
                style={{ background: "rgba(0, 0 , 0, .5)" }}
                className="top-0 left-0 z-10 fixed w-dvw h-dvh flex justify-center items-center px-8">

                <div className="flex flex-col gap-4 p-4 bg-background rounded-lg">
                    <b> Delete All Data? </b>
                    <p> This Action is irreversible. It will not delete your Financify-Account </p>
                    <div className="flex w-full gap-4">
                        <button
                            style={{ opacity: pending ? .5 : 1 }}
                            disabled={pending}
                            onClick={() => setVisible(false)} className="flex-1 py-2 bg-stack rounded-sm font-bold">Aboard</button>
                        <button
                            style={{ opacity: pending ? .5 : 1 }}
                            disabled={pending}
                            onClick={async () => await wipeUserData()} className="flex-1 py-2 bg-red-800 rounded-sm font-bold">Delete</button>
                    </div>
                </div>

            </div>)}


            <button
                onClick={() => setVisible(true)}
                className="bg-red-800 rounded-lg py-4 font-bold">
                Wipe all Data
            </button>
        </>
    );
}