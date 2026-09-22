'use client';

import { Digits } from "@/src/global/components";
import { useSearchData } from "@/src/hooks";
import { BookmarkIcon, CreditCardIcon, HandCoinsIcon, LucideIcon, LucideProps, TagIcon } from "lucide-react";

export default function Results() {


    const { results } = useSearchData();

    const iconConfig: LucideProps = {
        size: 20,
        opacity: .5
    }

    return (
        <div className="flex-1 flex flex-col gap-4 overflow-y-scroll">
            <ResultSubSection
                label="Transactions">
                {results.transactions.slice(0).map((t) => (
                    <div key={t.id} className="flex justify-between bg-stack px-4 py-2 rounded-sm">
                        <div className="flex gap-4 items-center">
                            <HandCoinsIcon {...iconConfig} />
                            <p> {t.name} </p>
                        </div>
                        <b> <Digits value={Number(t.value)} /> </b>
                    </div>
                ))}
            </ResultSubSection>
            <ResultSubSection
                label="Categories">
                {results.categories.map((c) => (
                    <div key={c.id} className="flex justify-between bg-stack px-4 py-2 rounded-sm">
                        <div className="flex gap-4 items-center">
                            <TagIcon {...iconConfig} />
                            <b> {c.name} </b>
                        </div>
                        <p className="text-foreground/50 text-sm"> {c.id} </p>
                    </div>
                ))}
            </ResultSubSection>
            <ResultSubSection
                label="Accounts">
                {results.accounts.map((a) => (
                    <div key={a.id} className="flex justify-between bg-stack px-4 py-2 rounded-sm">
                        <div className="flex gap-4 items-center">
                            <BookmarkIcon {...iconConfig} />
                            <b> {a.name} </b>
                        </div>
                        <p className="text-foreground/50 text-sm"> {a.id} </p>
                    </div>
                ))}
            </ResultSubSection>
            <ResultSubSection
                label="Subscriptions">
                {results.subscriptions.map((s) => (
                    <div key={s.id} className="flex justify-between bg-stack px-4 py-2 rounded-sm">
                        <div className="flex gap-4 items-center">
                            <CreditCardIcon {...iconConfig} />
                            <p> {s.name} </p>
                        </div>
                        <b> <Digits value={Number(s.value)} /> </b>
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