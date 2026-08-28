'use client';

import { WarningProps } from "@/src/static/client/warning";
import { TriangleAlertIcon } from "lucide-react";
import Link from "next/link";

interface _props {
    warning: WarningProps
}

export default function Warning({ warning }: _props) {

    return (
        <div className="bg-yellow-600/50 p-4 rounded-lg flex flex-col gap-4 border-2 border-yellow-400/50">
            <div className="flex gap-4 items-center">
                <TriangleAlertIcon size={20} />
                <b> Warning </b>
            </div>
            <p> {warning.body} </p>
            <Link
                className="w-full rounded-sm py-2 bg-yellow-400/50 flex justify-center font-bold"
                href={warning.href}>
                {warning.label}
            </Link>
        </div>
    );
}