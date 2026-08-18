'use client';

import Link from "next/link";

interface _props {
    activeSorting: string;
}

export type SORTING = "value-asc" | "value-desc" | "created-asc" | "created-desc";

export default function Sorting({ activeSorting }: _props) {

    type Filter = {
        id: number;
        label: string;
        hrefComponent: SORTING;
    }

    const filters: Filter[] = [
        { id: 3, label: "Created DESC", hrefComponent: "created-desc" },
        { id: 2, label: "Created ASC", hrefComponent: "created-asc" },
        { id: 0, label: "Value ASC", hrefComponent: "value-asc" },
        { id: 1, label: "Value DESC", hrefComponent: "value-desc" },
    ];

    return (
        <div className="flex gap-2 p-2 bg-stack rounded-lg">
            {filters.map((filter) => (
                <Link
                    style={{
                        backgroundColor: filter.hrefComponent === activeSorting ? "var(--color-foreground)" : "var(--color-background)",
                        color: filter.hrefComponent === activeSorting ? "var(--color-background)" : "var(--color-foreground)",
                    }}
                    key={filter.id}
                    className="flex-1 bg-background rounded-sm flex text-sm text-center px-2 py-1 items-center justify-center"
                    href={`/transactions/history?sort=${filter.hrefComponent}`}>
                    <p className="font-bold"> {filter.label} </p>
                </Link>
            ))}
        </div>
    );
}