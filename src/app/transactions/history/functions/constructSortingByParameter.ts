'use client';

import { ArrowDownIcon, ArrowUpIcon, LucideProps } from "lucide-react";
import Link from "next/link";
import React from "react";

interface _props {
    activeSorting: string;
}

export type SORTING = "value-asc" | "value-desc" | "created-asc" | "created-desc";

export default function Sorting({ activeSorting }: _props) {

    type Filter = {
        id: number;
        label: string;
        hrefComponent: SORTING;
        icon: React.ReactElement;
    }

    const lucideConfig: LucideProps = { size: 20, opacity: .5 }

    const filters: Filter[] = [
        { id: 3, label: "Created", hrefComponent: "created-desc", icon: React.createElement(ArrowDownIcon, lucideConfig) },
        { id: 2, label: "Created", hrefComponent: "created-asc", icon: React.createElement(ArrowUpIcon, lucideConfig) },
        { id: 0, label: "Value", hrefComponent: "value-asc", icon: React.createElement(ArrowUpIcon, lucideConfig) },
        { id: 1, label: "Value", hrefComponent: "value-desc", icon: React.createElement(ArrowDownIcon, lucideConfig) },
    ];

    return React.createElement(
        "div",
        { className: "flex gap-2 p-2 bg-stack rounded-lg" },
        filters.map((filter) => React.createElement(
            Link,
            {
                key: filter.id,
                style: {
                    backgroundColor: filter.hrefComponent === activeSorting
                        ? "var(--color-foreground)"
                        : "var(--color-background)",
                    color: filter.hrefComponent === activeSorting
                        ? "var(--color-background)"
                        : "var(--color-foreground)",
                },
                className: "flex-1 gap-2 bg-background rounded-sm flex text-sm text-center px-2 py-1 items-center justify-center",
                href: `/transactions/history?sort=${filter.hrefComponent}`,
            },
            filter.icon,
            React.createElement("p", { className: "font-bold" }, filter.label),
        )),
    );
}