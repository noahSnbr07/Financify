'use client';
import { useAuth } from "@/src/hooks";
import { Avatar } from "@/utils/components";

export default function AvatarCard() {

    const auth = useAuth();

    return (
        <div className="flex gap-4 p-4 bg-stack rounded-lg items-center">
            <Avatar size={64} />
            <b className="text-xl"> {auth?.name || "..."} </b>
        </div>
    );
}