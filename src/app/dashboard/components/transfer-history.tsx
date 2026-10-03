'use client';
import { Digits } from "@/src/global/components";
import { UniversalTransfer } from "@/src/server/get-dashboard-data";
import { ArrowRightIcon } from "lucide-react";

interface _props {
    transfers: UniversalTransfer[];
}
export default function TransferHistory({ transfers }: _props) {

    return (
        <div
            className="flex flex-col gap-2">
            {transfers.map((t) => (
                <div
                    key={t.id}
                    className="flex flex-col gap-4 p-4 bg-stack rounded-sm"
                >
                    <div className="flex flex-col">
                        <b> {t.name} </b>
                        <p className="text-sm text-foreground/50"> {t.created.toLocaleString()} </p>
                    </div>
                    <div className="grid grid-cols-3">
                        <p className="bg-stack p-2 rounded-sm"> {t.originAccount.name} </p>
                        <div className="grid place-content-center">
                            <ArrowRightIcon size={20} opacity={.5} />
                        </div>
                        <p className="bg-stack p-2 rounded-sm"> {t.destinationAccount.name} </p>
                    </div>
                    <div className="bg-background w-full p-2">
                        <b>
                            <Digits value={t.value} />
                        </b>
                    </div>
                </div>
            ))}
        </div>

    );
}