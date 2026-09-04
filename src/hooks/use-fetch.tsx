'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { APIResponse } from "../interfaces";
import { toast } from "react-toastify";

export enum SuccessAction {
    refresh,
    redirect,
}

interface _props {
    href: string;
    data?: unknown;
    redirectHref?: string;
    onSuccess: SuccessAction;
    feedback: {
        error: string;
        success: string;
    },
    submitConditions: boolean[],
}

type UseFetchResponse = {
    SubmitButton: React.JSX.Element;
}

export default function useFetch({ href, data, onSuccess, redirectHref = "", feedback, submitConditions }: _props): UseFetchResponse {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const conditionsFulfilled = submitConditions.every(Boolean);
    const blocked = isSubmitting || !conditionsFulfilled;
    const router = useRouter();

    async function callEndpoint() {
        if (blocked) return;
        setIsSubmitting(true);

        try {
            const response = await fetch(href, { method: "POST", body: JSON.stringify(data) });
            const responseData: APIResponse = await response.json();

            if (!response.ok || !responseData.success || responseData.status < 200 || responseData.status >= 300) {
                return toast(feedback.error, { type: "error" });
            }

            toast(feedback.success, { type: "success" });
            if (onSuccess === SuccessAction.redirect) router.push(redirectHref)
            else if (onSuccess === SuccessAction.refresh) router.refresh();

        } catch (error) {
            console.error(error);
            toast("Unhandled server error.", { type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        SubmitButton: (
            <button
                onClick={callEndpoint}
                disabled={blocked}
                style={{ opacity: blocked ? .5 : 1 }}
                className="w-full rounded-lg border-2 border-foreground flex justify-center items-center text-lg font-bold p-4"
            > Submit </button>
        ),
    };
}