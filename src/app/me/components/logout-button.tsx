'use client';

import { APIResponse } from "@/src/interfaces";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";


export default function LogoutButton() {

    const router = useRouter();

    async function logout() {

        try {
            const response = await fetch("/api/authentication/logout", { method: "POST" });
            const data: APIResponse<null> = await response.json();

            if (response.ok && data.success) router.push("/");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <button
            onClick={logout}
            className="flex gap-4 p-4 bg-foreground text-background justify-center items-center font-bold rounded-md">
            <LogOutIcon size={20} color="var(--background)" strokeWidth={2} />
            <p> Logout </p>
        </button>
    );
}