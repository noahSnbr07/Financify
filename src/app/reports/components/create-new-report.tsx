'use client';

import { SuccessAction, useFetch } from "@/src/hooks";

export default function CreateNewReport() {

    const { SubmitButton } = useFetch({
        feedback: {
            error: "Report could not be created",
            success: "Report has been created",
        },
        href: "/api/report/create",
        onSuccess: SuccessAction.refresh,
        submitConditions: [],
        data: {},
    })

    return (
        <>
            {SubmitButton}
        </>
    );
}