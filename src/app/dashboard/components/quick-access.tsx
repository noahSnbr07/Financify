"use client";

import Link from "next/link";

function QuickAccess() {

    const accessibleEndpoints = [
        { id: 0, name: "New Transaction", href: "/transactions/new" },
        { id: 1, name: "New Subscription", href: "/subscriptions/new" },
        { id: 2, name: "Transaction History", href: "/transactions/history" },
        { id: 3, name: "Manage Categories", href: "/categories/manage" },
        { id: 4, name: "Manage Subscriptions", href: "/subscriptions/manage" },
    ];

    return (
        <div className="flex gap-2 overflow-x-auto w-full whitespace-nowrap">
            {accessibleEndpoints.map(function (endpoint, _index: number) {
                return (
                    <div
                        className="px-4 py-1 bg-stack rounded-full max-h-8"
                        key={endpoint.id}>
                        <Link
                            href={endpoint.href}
                        >
                            <p> {endpoint.name} </p>
                        </Link>
                    </div>
                )
            })}
        </div>
    );

}

export default QuickAccess;