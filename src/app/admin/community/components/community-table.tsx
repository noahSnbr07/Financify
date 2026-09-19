'use client';

import { User, UserRole } from "@/src/generated/prisma/browser";
import { APIResponse } from "@/src/interfaces";
import { ROLE_COLORS } from "@/src/static/client";
import { CheckIcon, LockIcon, ShieldIcon } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { CSSProperties } from "react";
import { toast } from "react-toastify";


interface _props {
    users: Omit<User, "hash">[]
}
export default function CommunityTable({ users }: _props) {


    return (
        <div className="flex flex-col bg-stack rounded-lg">
            <div className="bg-stack gap-4 p-4 grid grid-cols-5 rounded-sm">
                <p> UUID </p>
                <p> Name </p>
                <p> Role </p>
                <p> Created </p>
            </div>
            {users.map(function (user) {
                return (
                    <UserRow key={user.id} user={user} />
                )
            })}
        </div>
    );
}

function UserRow({ user }: { user: Omit<User, "hash"> }) {

    return (
        <div className="p-4 grid gap-4 grid-cols-5 items-center">
            <i className="truncate"> {user.id} </i>
            <p> {user.name} </p>
            <UserRowRoleIndicator role={user.role} />
            <p> {user.created.toLocaleDateString()} </p>
            <UserRoleUpdater user={user} />
        </div>
    )
}

const colorForRole = (role: UserRole): string => {
    return role === UserRole.admin ?
        ROLE_COLORS.ADMIN : role === UserRole.regular ?
            ROLE_COLORS.REGULAR : role === UserRole.suspended ?
                ROLE_COLORS.SUSPENDED : "var(--color-foreground)"
}

function UserRowRoleIndicator({ role }: { role: UserRole }) {

    const config = {
        size: 20, color: colorForRole(role)
    }

    return (
        <div className="flex gap-2 items-center">
            {role === UserRole.admin ? <ShieldIcon {...config} />
                : role === UserRole.regular ? <CheckIcon {...config} /> :
                    <LockIcon {...config} />}
            <b style={{ color: colorForRole(role) }}> {role} </b>
        </div>
    )
}

async function updateUserRole(userId: string, newRole: UserRole, router: AppRouterInstance): Promise<void> {


    const endpoint = "/api/admin/update-user-role";
    const init: RequestInit = { method: "POST", body: JSON.stringify({ userId, newRole }) }

    const response = await fetch(endpoint, init)
    if (!response.ok) toast("Uncaught Client Error", { type: "error" });

    const data: APIResponse = await response.json();
    toast(data.message, { type: data.success ? "success" : "error" });

    return router.refresh();

}

function UserRoleUpdater({ user }: { user: Omit<User, "hash"> }) {

    const router = useRouter();

    const getStyleSheet = (role: UserRole): CSSProperties => ({
        background: role === user.role ? "var(--stack)" : "transparent"
    });

    return (
        <div className="flex bg-stack rounded-sm gap-4">
            <button
                onClick={() => updateUserRole(user.id, UserRole.regular, router)}
                className="px-2 py-1 text-sm"
                style={getStyleSheet(UserRole.regular)}> Regular </button>
            <button
                onClick={() => updateUserRole(user.id, UserRole.admin, router)}
                className="px-2 py-1 text-sm"
                style={getStyleSheet(UserRole.admin)}> Admin </button>
            <button
                onClick={() => updateUserRole(user.id, UserRole.suspended, router)}
                className="px-2 py-1 text-sm"
                style={getStyleSheet(UserRole.suspended)}> Suspended </button>
        </div>
    )
}