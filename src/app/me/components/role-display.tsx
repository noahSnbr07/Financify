'use client';

import { UserRole } from "@/src/generated/prisma/enums";
import { ROLE_COLORS } from "@/src/static/client";
import { CheckIcon, LockIcon, ShieldIcon } from "lucide-react";

interface _props {
    role: UserRole;
}
export default function RoleDisplay({ role }: _props) {


    return (
        <div className="bg-stack rounded-lg p-4 flex justify-center">
            <UserRoleIcon role={role} />
        </div>
    );
}

const colorForRole = (role: UserRole): string => {
    return role === UserRole.admin ?
        ROLE_COLORS.ADMIN : role === UserRole.regular ?
            ROLE_COLORS.REGULAR : role === UserRole.suspended ?
                ROLE_COLORS.SUSPENDED : "var(--color-foreground)"
}

function UserRoleIcon({ role }: { role: UserRole }) {

    const config = {
        size: 20, color: colorForRole(role)
    }

    return (
        <div className="flex items-center gap-2">
            {role === UserRole.admin ? <ShieldIcon {...config} />
                : role === UserRole.regular ? <CheckIcon {...config} /> :
                    <LockIcon {...config} />}
            <b style={{ color: colorForRole(role) }}> {`${role[0].toUpperCase()}${role.slice(1)}`} </b>
        </div>
    )
}