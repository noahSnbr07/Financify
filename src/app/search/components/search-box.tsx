'use client';

import { useEffect, useRef } from "react";
import { useSearchData } from "@/src/hooks";

export default function Searchbox() {

    const { functions } = useSearchData();
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    function query(value: string) {

        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => functions.search(value), 250);

    }

    useEffect(() => () => {
        if (timeout.current) clearTimeout(timeout.current);
    }, []);

    return (
        <input
            autoFocus
            className="bg-stack p-4 h-min rounded-lg"
            type="text"
            placeholder="query ..."
            onChange={(event) => query(event.target.value)}
        />
    );
}