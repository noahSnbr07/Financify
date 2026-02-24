'use client';

import { SendHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AIChatBox() {

    const router = useRouter();

    return (
        <button
            className="bg-foreground rounded-sm w-full text-background p-2 font-bold flex justify-center items-center gap-4"
            onClick={() => router.push("/chat")}
        >
            Go To Chat   <SendHorizontalIcon size={16} color="var(--background)" />
        </button>
    );
}