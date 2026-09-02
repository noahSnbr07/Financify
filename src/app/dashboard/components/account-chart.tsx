'use client';

import { ParsedAccount } from "@/src/server/get-dashboard-data";
import { Bar, BarChart, CartesianGrid, createHorizontalChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface _props {
    accounts: ParsedAccount[];
}

export default function AccountChart({ accounts }: _props) {

    const data: Readonly<ParsedAccount[]> = accounts;

    const Typed = createHorizontalChart<ParsedAccount, string, number>()({
        BarChart,
        Bar,
        XAxis,
        YAxis,
    });


    return (
        <ResponsiveContainer
            minHeight={256}
        >

            <BarChart
                data={data}
                margin={{ bottom: 24, left: 16, right: 16, top: 16 }}
            >

                <CartesianGrid amplitude={100} opacity={.5} />
                <Typed.XAxis dataKey="name" />

                <Bar fill="orangered" dataKey="negativeSum" stackId="a" opacity={.75} strokeWidth={0} label />
                <Bar fill="limegreen" dataKey="positiveSum" stackId="a" opacity={.75} strokeWidth={0} label />

            </BarChart>
        </ResponsiveContainer>
    );
}