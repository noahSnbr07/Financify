'use client';

import { APIResponse } from "@/src/interfaces";
import { Image } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";


export default function UpdateAvatar() {

    const [pending, setPending] = useState<boolean>(false);
    const router = useRouter();

    async function updateAvatar(files: FileList | null): Promise<void> {

        if (!files) return;

        if (pending) return;
        else setPending(true);

        const formData = new FormData();
        formData.append("avatar", files[0]);

        const url: string = "/api/me/avatar/update";
        const options: RequestInit = { method: "POST", body: formData, }

        try {
            const response = await fetch(url, options);
            const data: APIResponse = await response.json();
            if (response.ok && data.success) toast("Avatar changed.", { type: "success" });
            else toast(data.message, { type: "error" });

        } catch (error) {
            console.error(error);
            toast("Uncaught Client Error", { type: "error" });
        } finally {
            setPending(false);
            router.refresh();
        }

    }

    return (
        <div className="bg-stack rounded-lg p-4 flex justify-center">
            <label
                className="text-center w-full font-bold flex gap-2 text-foreground/50"
                htmlFor="avatar">
                <Image opacity={.5} />
                Change Avatar
            </label>
            <input
                className="hidden"
                onChange={(event: ChangeEvent<HTMLInputElement>) => { updateAvatar(event.target.files) }}
                type="file"
                accept="image/*"
                name="avatar"
                id="avatar"
            />
        </div>
    );
}