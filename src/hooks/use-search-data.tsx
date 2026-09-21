'use client';

import { createContext, useContext, useState } from "react";
import { Account, Category, Subscription, Transaction } from "../generated/prisma/browser";
import { toast } from "react-toastify";
import { APIResponseWithData } from "../interfaces";
import { SearchResult } from "../app/api/search/route";

type SearchResultTransaction = Pick<Transaction, "name" | "id" | "value" | "created" | "type">;
type SearchResultCategory = Pick<Category, "name" | "id" | "created">;
type SearchResultAccount = Pick<Account, "name" | "id" | "created">;
type SearchResultSubscription = Pick<Subscription, "name" | "id" | "value" | "created" | "state">;

export { type SearchResultAccount, type SearchResultCategory, type SearchResultSubscription, type SearchResultTransaction }

interface UseSearchDataProps {
    query: string;
    results: {
        transactions: SearchResultTransaction[];
        categories: SearchResultCategory[];
        accounts: SearchResultAccount[];
        subscriptions: SearchResultSubscription[];
    }
    functions: {
        search: (query: string) => Promise<void>;
        clear: () => void;
        getQuery: () => Readonly<string>;
    }
}

const SearchDataContext = createContext<UseSearchDataProps | undefined>(undefined);

function useSearchDataState(): UseSearchDataProps {

    const [pending, setPending] = useState<boolean>(false);
    const [queryValue, setQueryValue] = useState("");
    const [results, setResults] = useState<UseSearchDataProps["results"]>({
        accounts: [], categories: [], subscriptions: [], transactions: [],
    });

    async function search(query: string): Promise<void> {
        if (pending) return;

        if (query.trim().length < 1) {
            setQueryValue("");
            setResults({ accounts: [], categories: [], subscriptions: [], transactions: [] });
            return;
        }
        setPending(true);
        setQueryValue(query);

        try {

            const response = await fetch("/api/search", { method: "POST", body: JSON.stringify({ query }) });
            if (!response.ok) toast.error("Uncaught Client Error");

            const responseData: APIResponseWithData<SearchResult> = await response.json();
            if (!responseData.success || responseData.status !== 200) toast.error("Uncaught Client Error");
            setResults(responseData.data);

        } catch (error) {
            if (error instanceof Error) toast.error(error.message);
        } finally {
            setPending(false);
        }

    }

    function getQuery() { return queryValue; }

    function clear() { setResults({ accounts: [], categories: [], subscriptions: [], transactions: [] }); }

    return { query: queryValue, results, functions: { search, clear, getQuery } };
}

export function SearchDataProvider({ children }: { children: React.ReactNode }) {
    return (
        <SearchDataContext.Provider value={useSearchDataState()}>
            {children}
        </SearchDataContext.Provider>
    );
}

export default function useSearchData(): UseSearchDataProps {
    const context = useContext(SearchDataContext);
    if (!context) throw new Error("useSearchData must be used within SearchDataProvider");
    return context;
}