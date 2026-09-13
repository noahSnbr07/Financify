'use client';

import { FormStateIndicator } from "@/utils/form-components";
import { CreateTransactionShape } from "./create-transaction-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { APIResponseWithData } from "@/src/interfaces/api-response";
import { ReturnedData } from "@/src/app/api/functions/get-balance-calculation/route";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

interface _props {
    newTransaction: CreateTransactionShape;
}

export default function BalanceCalculation({ newTransaction }: _props) {

    const href = "/api/functions/get-balance-calculation";

    const [data, setData] = useState<ReturnedData>({
        newBalance: 0,
        newBudget: 0,
        oldBalance: 0,
        oldBudget: 0,
        transactionBudget: 0,
        transactionValue: 0,
    });

    useEffect(function () {

        async function refetchData() {

            const response = await fetch(href, {
                method: "POST",
                body: JSON.stringify({
                    value: newTransaction.value,
                    received: !newTransaction.spent,
                }),
            });
            if (!response.ok) {
                toast("Uncaught server error.", { type: "error" });
                return;
            }

            const data: APIResponseWithData<ReturnedData> = await response.json();
            setData(data.data);
        }

        const timeout = setTimeout(refetchData, 2000);
        return () => clearTimeout(timeout);
    }, [newTransaction.value, newTransaction.spent]);

    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <FormStateIndicator label="New Balance:" value={String(data.newBalance || "loading ...")} />
            <div className="flex flex-col last:border-b-2 border-stack">
                <div className="p-2 grid grid-cols-5 border-t-2 border-stack">
                    <p> {" "} </p>
                    <p> Old </p>
                    <p> New </p>
                    <p> Delta </p>
                    <p> Trend </p>
                </div>
                {data && (
                    <>
                        <DataDelta delta={String(data.transactionValue)} metric="$" label="Balance" newValue={data.newBalance} oldValue={data.oldBalance} />
                        <DataDelta delta={String(data.transactionBudget)} metric="%" label="Budget" newValue={data.newBudget} oldValue={data.oldBudget} />
                    </>
                )}
            </div>
        </div>
    );
}

function DataDelta({ oldValue, newValue, label, metric, delta }: { oldValue: number; newValue: number; label: string; metric: string; delta: string; }) {

    const TrendIcon = Boolean(newValue > oldValue) ? <TrendingUpIcon opacity={.5} size={20} /> : <TrendingDownIcon opacity={.5} size={20} />

    return (
        <div className="p-4 grid grid-cols-5 border-y-2 odd:border-none border-stack items-center">
            <p> {label} </p>
            <b> {oldValue}{metric} </b>
            <b> {newValue}{metric} </b>
            <b> {delta}{metric} </b>
            <b> {TrendIcon} </b>
        </div>
    );
}