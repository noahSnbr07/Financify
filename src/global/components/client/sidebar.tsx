'use client';

import { usePrivacyToggler, useSidebarToggler } from "@/src/hooks";
import SidebarTogglerButton from "./sidebar-toggler-button";
import { AnimatePresence, motion } from "framer-motion"
import { BotMessageSquareIcon, EyeIcon, EyeOffIcon, LayoutDashboardIcon, PlusIcon, Settings2Icon, XIcon } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

export default function Sidebar() {

    const sidebar = useSidebarToggler();
    const privacyButton = usePrivacyToggler();


    return (
        <AnimatePresence>
            {!sidebar?.hidden && <motion.div
                initial={{ opacity: 0, x: "-100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "-100%" }}
                transition={{ type: "keyframes" }}
                className="fixed flex z-10 top-0 left-0 w-full h-full bg-background/50">
                <div className="flex flex-col w-full bg-background md:w-1/2 lg:w-1/3">
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
                        <SidebarLink
                            href="/transactions/new"
                            icon={<PlusIcon opacity={.5} />}
                            label="Create Transaction"
                            toggle={sidebar!.toggle}
                        />
                        <SidebarLink
                            href="/categories/new"
                            icon={<PlusIcon opacity={.5} />}
                            label="Create Category"
                            toggle={sidebar!.toggle}
                        />
                        <SidebarLink
                            href="/accounts/new"
                            icon={<PlusIcon opacity={.5} />}
                            label="Create Account"
                            toggle={sidebar!.toggle}
                        />
                        <SidebarLink
                            href="/subscriptions/new"
                            icon={<PlusIcon opacity={.5} />}
                            label="Create Subscription"
                            toggle={sidebar!.toggle}
                        />
                        <hr className="border-2 rounded-full border-stack" />
                        <SidebarLink
                            href="/dashboard"
                            icon={<LayoutDashboardIcon opacity={.5} />}
                            label="Dashboard"
                            toggle={sidebar!.toggle}
                        />
                        <SidebarLink
                            href="/chat"
                            icon={<BotMessageSquareIcon opacity={.5} />}
                            label="Ask Fluffle AI"
                            toggle={sidebar!.toggle}
                        />
                        <SidebarLink
                            href="/settings"
                            icon={<Settings2Icon opacity={.5} />}
                            label="Settings"
                            toggle={sidebar!.toggle}
                        />
                        <hr className="border-2 rounded-full border-stack" />
                        <button
                            onClick={sidebar?.toggle}
                            className="bg-red-600/50 font-bold flex gap-4 p-4 rounded-lg">
                            <XIcon opacity={.5} />
                            Collapse Sidebar
                        </button>
                    </div>
                </div>
            </motion.div>}
        </AnimatePresence>
    );
}

interface SidebarLink {
    label: string;
    href: string;
    icon: React.JSX.Element;
    toggle: () => void;
}

function SidebarLink({ label, href, icon, toggle }: SidebarLink) {

    const router = useRouter();

    function sidebarNavigateTo() {
        router.push(href);
        toggle();
    }

    return (
        <button
            onClick={sidebarNavigateTo}
            className="flex gap-4 p-4 bg-stack font-bold rounded-lg">
            {icon}
            {label}
        </button>
    )
}