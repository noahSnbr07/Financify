'use client';

import { Digits } from "@/src/global/components";
import type { ParsedAccount } from "@/src/server/get-dashboard-data";

interface _props {
    accounts: ParsedAccount[];
}
export default function AccountVolumes({ accounts }: _props) {


    return (
        <div className="grid grid-cols-2 gap-2">
            {accounts.map(function (account) {

                return (
                    <div
                        style={{ background: account.color }}
                        key={account.id}
                        className="border-2 border-stack p-2 flex justify-between gap-2 rounded-md">
                        <i> {account.name} </i>
                        <b> <Digits value={account.volume} /> </b>
                    </div>
                )
            })}
        </div>
    );
}