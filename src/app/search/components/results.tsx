'use client';

import { Digits } from "@/src/global/components";
import { useSearchData } from "@/src/hooks";


export default function Results() {

    const { results } = useSearchData();

    return (
        <div className="flex-1 flex flex-col gap-4 overflow-y-scroll">
            <ResultSubSection
                label="Transactions">
                {results.transactions.map((t) => (
                    <div key={t.id} className="flex justify-between bg-stack px-4 py-2 rounded-sm">
                        <p> {t.name} </p>
                        <Digits value={Number(t.value)} />
                    </div>
                ))}
            </ResultSubSection>
            <ResultSubSection
                label="Categories">
                {results.categories.map((c) => (
                    <div key={c.id} className="flex justify-between bg-stack px-4 py-2 rounded-sm">
                        <p> {c.name} </p>
                        <b> {c.id} </b>
                    </div>
                ))}
            </ResultSubSection>
            <ResultSubSection
                label="Accounts">
                {results.accounts.map((a) => (
                    <div key={a.id} className="flex justify-between bg-stack px-4 py-2 rounded-sm">
                        <p> {a.name} </p>
                        <b> {a.id} </b>
                    </div>
                ))}
            </ResultSubSection>
            <ResultSubSection
                label="Subscriptions">
                {results.subscriptions.map((s) => (
                    <div key={s.id} className="flex justify-between bg-stack px-4 py-2 rounded-sm">
                        <p> {s.name} </p>
                        <Digits value={Number(s.value)} />
                    </div>
                ))}
            </ResultSubSection>
        </div>
    );
}

function ResultSubSection({ label, children }: { label: string; children: React.ReactNode; }) {

    return (
        <div className="flex flex-col gap-2">
            <b className="w-full text-center text-foreground/50"> {label} </b>
            <div className="flex flex-col gap-2"> {children} </div>
        </div>
    )
}