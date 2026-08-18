'use client';

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateNewReport() {

    const [pending, setPending] = useState<boolean>(false);
    const router = useRouter();

    async function createNewReport(): Promise<void> {
        setPending(true);

        const url = `/api/report/create`;
        const options: RequestInit = { method: "POST" }

        try {
            await fetch(url, options);
        } catch (error) {
            console.error(error);
        } finally {
            setPending(false);
            router.refresh();
        }
    }

    return (
        <button
            disabled={pending}
            style={{ opacity: pending ? .5 : 1 }}
            onClick={async () => await createNewReport()}
            className="bg-foreground text-background flex justify-center items-center gap-4 py-4 rounded-lg cursor-pointer">
            <PlusIcon size={24} color="black" />
            <b> Create New Report </b>
        </button>
    );
}