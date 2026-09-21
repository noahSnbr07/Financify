'use client';
import { SearchDataProvider } from "@/src/hooks";
import Searchbox from "./search-box";
import Results from "./results";

export default function StateWrapper() {

    return (
        <SearchDataProvider>
            <div className="flex h-full flex-1 flex-col gap-4">
                <Searchbox />
                <Results />
            </div>
        </SearchDataProvider>
    );
}