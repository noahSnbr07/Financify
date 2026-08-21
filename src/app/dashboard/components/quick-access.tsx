"use client";

import { motion } from "framer-motion";
import Link from "next/link";

function QuickAccess() {

    const accessibleEndpoints = [
        { id: 0, name: "New Transaction", href: "/transactions/new" },
        { id: 1, name: "New Account", href: "/accounts/new" },
        { id: 2, name: "New Category", href: "/categories/new" },
        { id: 3, name: "Transaction History", href: "/transactions/history" },
        { id: 4, name: "Manage Categories", href: "/categories/manage" },
        { id: 5, name: "Reports", href: "/reports" },
    ];

    return (
        <div className="flex gap-2 overflow-x-auto w-full whitespace-nowrap">
            {accessibleEndpoints.map(function (endpoint, _index: number) {
                return (
                    <motion.div
                        transition={{ delay: .25 * _index }}
                        initial={{ opacity: 0, height: 0, width: 0 }}
                        animate={{ opacity: 1, height: "auto", width: "auto" }}
                        className="px-4 py-1 bg-stack rounded-full max-h-8"
                        key={endpoint.id}>
                        <Link
                            href={endpoint.href}
                        >
                            <p> {endpoint.name} </p>
                        </Link>
                    </motion.div>
                )
            })}
        </div>
    );

}

export default QuickAccess;