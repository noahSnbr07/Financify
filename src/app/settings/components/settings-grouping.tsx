'use client';

import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { APIResponse } from "@/src/interfaces";

interface SectionProps {
    label: string;
    subsections: SubSectionProps[];
}

interface SubSectionProps {
    id: number;
    icon: React.JSX.Element;
    label: string;
    description: string;
    apiEndpoint: string;
    destructiveOperation?: boolean;
    buttonLabel: string;
}

function Section({ subsections, label }: SectionProps) {


    return (
        <div className="flex flex-col gap-2">
            <b className="text-lg text-center text-foreground/75"> {label} </b>
            {subsections.map((subsection) => (
                <SubSection
                    key={subsection.id}
                    {...subsection}
                />
            ))}
        </div>
    );
}

function SubSection({ icon, label, description, id, apiEndpoint, destructiveOperation = false, buttonLabel }: SubSectionProps) {

    const [pending, setPending] = useState<boolean>(false);

    return (
        <div
            className="flex flex-col gap-4 bg-stack rounded-lg">
            <div className="flex gap-4 p-4 items-center bg-stack rounded-t-lg">
                {icon}
                <b> {label} </b>
            </div>
            <div className="px-4 text-foreground/50"> · {description} </div>
            <div className="p-4">
                <button
                    disabled={pending}
                    onClick={async () => await callEndpoint(apiEndpoint, pending, setPending)}
                    className="w-full p-4 rounded-sm font-bold"
                    style={{
                        opacity: pending ? .5 : 1,
                        background: destructiveOperation ? "#bf2f2f" : "var(--foreground)",
                        color: destructiveOperation ? "var(--foreground)" : "var(--background)"
                    }}
                > {buttonLabel} </button>
            </div>
        </div>
    );
}

export {
    Section,
    SubSection,
}

async function callEndpoint(href: string, pending: boolean, setPending: Dispatch<SetStateAction<boolean>>): Promise<void> {

    if (pending) return;
    setPending(true);

    try {
        const options: RequestInit = { method: "POST", }
        const response = await fetch(href, options);
        if (!response.ok) toast("Uncaught server error.", { type: "error" });

        const data: APIResponse = await response.json();
        toast(data.message, { type: data.success ? "success" : "error" });
    } catch (error) {
        if (error instanceof Error) toast(error.message, { type: "error" });
        else toast("Uncaught server error.", { type: "error" });
    } finally {
        setPending(false);
    }
}