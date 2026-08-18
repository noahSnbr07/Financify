'use client';

import { UserIcon } from "lucide-react";

interface _props {
    id: string;
}

export default function UUIDDisplay({ id }: _props) {

    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-md">
            <p className="text-foreground/50"> Universally Unique Identifier: </p>
            <div className="flex gap-4 items-center">
                <UserIcon size={20} />
                <b className="text-foreground/50"> {id}  </b>
            </div>
        </div>
    );
}