"use client";

import { FolderIcon, LayoutDashboardIcon, MessageCircleMoreIcon, PlusIcon, Settings2Icon, ShieldIcon, User2Icon } from "lucide-react";

export interface SidebarLink {
    id: number;
    label: string;
    href: string;
    icon: React.JSX.Element;
}

const sidebarLinks: Record<string, SidebarLink[]> = {
    create: [
        { id: 0, label: "New Transaction", href: "/transactions/new", icon: <PlusIcon size={32} opacity={.5} /> },
        { id: 1, label: "New Category", href: "/categories/new", icon: <PlusIcon size={32} opacity={.5} /> },
        { id: 2, label: "New Account", href: "/accounts/new", icon: <PlusIcon size={32} opacity={.5} /> },
        { id: 3, label: "New Subscription", href: "/subscriptions/new", icon: <PlusIcon size={32} opacity={.5} /> },
    ],
    base: [
        { id: 0, label: "Dashboard", href: "/dashboard", icon: <LayoutDashboardIcon opacity={.5} /> },
        { id: 1, label: "Profile", href: "/me", icon: <User2Icon opacity={.5} /> },
        { id: 2, label: "AI Chat", href: "/chat", icon: <MessageCircleMoreIcon opacity={.5} /> },
        { id: 3, label: "Settings", href: "/settings", icon: <Settings2Icon opacity={.5} /> },
        { id: 4, label: "Admin Panel", href: "/admin", icon: <ShieldIcon opacity={.5} /> },
    ],
    manage: [
        { id: 0, label: "Manage Transactions", href: "/transactions/manage", icon: <FolderIcon opacity={.5} /> },
        { id: 1, label: "Manage Categories", href: "/categories/manage", icon: <FolderIcon opacity={.5} /> },
        { id: 2, label: "Manage Accounts", href: "/accounts/manage", icon: <FolderIcon opacity={.5} /> },
        { id: 3, label: "Manage Subscriptions", href: "/subscriptions/manage", icon: <FolderIcon opacity={.5} /> },
        { id: 4, label: "Manage Reports", href: "/reports", icon: <FolderIcon opacity={.5} /> },
    ]
}

export default sidebarLinks;