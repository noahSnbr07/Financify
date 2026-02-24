'use client';

import { ParsedExtendedTransaction } from "@/src/server/get-dashboard-data";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    YAxis
} from "recharts";

interface Props {
    transactions: ParsedExtendedTransaction[];
}

export default function BalanceChart({ transactions }: Props) {
    const data = transactions.reduce((acc, t, i) => {
        const amount = Number(t.value);

        const prevBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
        const balance = prevBalance + (t.received ? amount : -amount);

        acc.push({
            index: i,
            balance,
            income: t.received ? amount : 0,
            expense: !t.received ? amount : 0,
        });

        return acc;
    }, [] as {
        index: number;
        balance: number;
        income: number;
        expense: number;
    }[]);


    return (
        <div className="w-full h-full min-h-64 min-w-0">
            <ResponsiveContainer className={"h-full w-full min-h-64 min-w-64"} aspect={undefined} minHeight={256}>
                <LineChart
                    height={"100%"}
                    width={"100%"}
                    data={data}>
                    <YAxis />
                    <CartesianGrid vertical={false} opacity={0.5} />

                    <Line type="monotone" dataKey="expense" strokeWidth={2} stroke="rgba(255,0,0,.75)" dot={false} />
                    <Line type="monotone" dataKey="income" strokeWidth={2} stroke="rgba(0,255,0,.75)" dot={false} />
                    <Line type="monotone" dataKey="balance" strokeWidth={2} stroke="rgba(0,255,255,.75)" dot={false} />

                    <Legend />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}