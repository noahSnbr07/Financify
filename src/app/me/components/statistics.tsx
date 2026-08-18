'use client';

import { UserDatabaseStats } from "@/src/server/get-user-database-stats";

type _props = UserDatabaseStats;

export default function Statistics({ totalAccounts, totalCategories, totalTransactions }: _props) {


    return (
        <div className="bg-stack rounded-md p-4 flex justify-evenly">
            <StatisticEntry label="Accounts" value={totalAccounts} />
            <StatisticEntry label="Categories" value={totalCategories} />
            <StatisticEntry label="Transactions" value={totalTransactions} />
        </div>
    );
}

function StatisticEntry({ label, value }: { label: string; value: number; }) {

    return (
        <div className="flex flex-col gap-2 items-center">
            <p className="text-sm"> {label} </p>
            <b className="text-lg bg-stack rounded-sm p-1 aspect-square text-center"> {value} </b>
        </div>
    );
}