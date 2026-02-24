'use client';

import { CalendarIcon } from "lucide-react";

interface _props {
    created: Date;
}

export default function MemberSince({ created }: _props) {


    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-md">
            <p className="text-foreground/50"> Member Since:</p>
            <div className="flex gap-4 items-center">
                <CalendarIcon size={20} />
                <b className="text-foreground/50"> {new Date(created).toLocaleDateString()} - {new Date(created).toLocaleTimeString()} </b>
            </div>
        </div>
    );
}