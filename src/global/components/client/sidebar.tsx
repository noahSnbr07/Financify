'use client';

import { usePrivacyToggler, useSidebarToggler } from "@/src/hooks";
import SidebarTogglerButton from "./sidebar-toggler-button";
import { EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type SidebarLink, sidebarLinks } from "@/src/static/client";
import Link from "next/link";

export default function Sidebar() {

    const sidebar = useSidebarToggler();
    const privacyButton = usePrivacyToggler();

    return !sidebar?.hidden && (
        <div
            className="fixed flex z-10 top-0 left-0 w-full h-full bg-background/50">
            <div className="flex flex-col w-full overflow-y-auto bg-background md:w-1/2 lg:w-1/3">
                <div className="p-4 h-16.5 flex items-center gap-4 border-b-2 border-foreground/50">
                    <SidebarTogglerButton />
                    <b> Menu </b>
                </div>
                <div className="flex-1 p-4 flex flex-col gap-4">
                    <button
                        onClick={privacyButton?.toggle}
                        className="bg-stack p-4 flex gap-4 font-bold rounded-lg">
                        {privacyButton?.hidden ? <EyeIcon opacity={.5} /> : <EyeOffIcon opacity={.5} />}
                        {privacyButton?.hidden ? "Show Digits" : "Hide Digits"}
                    </button>
                    <hr className="border-2 rounded-full border-stack" />
                    <div className="flex flex-col gap-4">
                        {sidebarLinks.base.map((link) => (
                            <Link
                                onClick={() => sidebar?.toggle()}
                                className="bg-stack flex rounded-lg font-bold p-4 gap-4"
                                key={link.id}
                                href={link.href}>
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <hr className="border-2 rounded-full border-stack" />
                    <div className="grid grid-cols-2 gap-4">
                        {sidebarLinks.create.map((link) => (
                            <SidebarLink
                                key={link.id}
                                {...link}
                            />
                        ))}
                    </div>

                    <hr className="border-2 rounded-full border-stack" />
                    <div className="grid gap-4 grid-cols-2">
                        {sidebarLinks.manage.map((link) => (
                            <SidebarLink
                                key={link.id}
                                {...link} />
                        ))}
                    </div>
                    <hr className="border-2 rounded-full border-stack" />
                    <button
                        onClick={sidebar?.toggle}
                        className="bg-red-600/50 font-bold flex gap-4 p-4 rounded-lg">
                        <XIcon opacity={.5} />
                        Collapse Sidebar
                    </button>
                </div>
            </div>
        </div>
    );
}

function SidebarLink({ label, href, icon }: SidebarLink) {

    const router = useRouter();
    const sidebar = useSidebarToggler();

    function sidebarNavigateTo() {
        router.push(href);
        sidebar?.toggle();
    }

    return (
        <button
            onClick={sidebarNavigateTo}
            className="flex flex-col text-sm text-foreground/50 items-center gap-4 p-4 bg-stack font-bold rounded-lg">
            {icon}
            {label}
        </button>
    )
}