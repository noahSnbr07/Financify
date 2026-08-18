"use client";

import { APIResponse } from "@/src/interfaces";
import { MessageCircleWarningIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function AuthenticationForm() {

    const data: RequestInit = { method: "POST" };

    const [pending, setPending] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const router = useRouter();

    async function submitForm(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPending(true);
        setMessage("");

        try {

            const form = event.currentTarget;
            const formData = new FormData(form);

            const button = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
            const action = button.value;

            const payload = {
                name: formData.get("name"),
                password: formData.get("password"),
            };

            const endpoint = `/api/authentication/${action}`;

            const response = await fetch(endpoint, { ...data, body: JSON.stringify(payload) });
            const responseData: APIResponse<null> = await response.json();

            setMessage(responseData.message);
            setPending(false);

            if (response.ok && responseData.success) router.push("/dashboard");

        } catch (error) {
            if (error instanceof Error) {
                setMessage(error.message)
            }
        }
    }

    return (
        <form
            onSubmit={(event: FormEvent<HTMLFormElement>) => submitForm(event)}
            className="flex w-full max-w-xl flex-col gap-4 p-4 bg-stack rounded-lg items-center"
        >

            <b> Authentication </b>

            <input
                className="w-full bg-stack rounded-sm p-2"
                type="text"
                name="name"
                id="name"
                placeholder="name"
            />

            <input
                className="w-full bg-stack rounded-sm p-2"
                type="password"
                name="password"
                id="password"
                placeholder="password"
            />
            <div className="w-full flex gap-4">
                <button
                    type="submit"
                    name="action"
                    value="login"
                    className="bg-foreground text-background w-full rounded-sm p-4 font-bold"
                >
                    Login
                </button>
                <button
                    type="submit"
                    name="action"
                    value="register"
                    className="bg-foreground text-background w-full rounded-sm p-4 font-bold"
                >
                    Register
                </button>
            </div>

            <ResponseBox
                pending={pending}
                message={message}
                show={message.length > 0}
            />

        </form>
    );
}

export default AuthenticationForm;

function ResponseBox({ show, message, pending }: { show: boolean; message: string; pending: boolean; }) {

    if (!show || message.length <= 0) return;

    return (
        <div className="p-2 w-full rounded-sm bg-yellow-500/25 items-center border-yellow-500 border-2 flex gap-2">
            <MessageCircleWarningIcon color="yellow" size={20} />
            <i> {!pending ? message : "Pending Request ..."} </i>
        </div>
    )
}