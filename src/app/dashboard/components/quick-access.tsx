import Link from "next/link";

async function QuickAccess() {

    const accessibleEndpoints = [
        { id: 0, name: "New Transaction", href: "/transactions/new" },
        { id: 1, name: "New Account", href: "/accounts/new" },
        { id: 2, name: "New Category", href: "/categories/new" },
        { id: 3, name: "Transaction History", href: "/transactions/history" },
    ];

    return (
        <div className="flex gap-2 overflow-x-auto w-full whitespace-nowrap">
            {accessibleEndpoints.map(function (endpoint) {
                return (
                    <Link
                        key={endpoint.id}
                        href={endpoint.href}
                        className="px-4 py-1 bg-stack rounded-full max-h-8"
                    >
                        <p> {endpoint.name} </p>
                    </Link>
                )
            })}
        </div>
    );

}

export default QuickAccess;