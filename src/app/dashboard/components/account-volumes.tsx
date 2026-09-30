'use client';

import { Digits } from "@/src/global/components";
import type { ParsedAccount } from "@/src/server/get-dashboard-data";
import { TrendingDownIcon, TrendingUpDownIcon, TrendingUpIcon } from "lucide-react";

interface _props {
    accounts: ParsedAccount[];
}
export default function AccountVolumes({ accounts }: _props) {


    return (
        <div className="grid grid-cols-2 gap-2">
            {accounts.map(function (account) {

                return (
                    <div
                        key={account.id}
                        className="border-2 border-stack p-4 flex justify-between gap-2 rounded-md">
                        <div className="flex items-center gap-4">
                            <div
                                style={{ background: account.color }}
                                className="size-2 rounded-full"></div>
                            <b> {account.name} </b>
                        </div>
                        <VolumeLabel value={account.volume} />
                    </div>
                )
            })}
        </div>
    );
}

interface VolumeLabelProps {
    value: number;
}


function getTrendIcon(value: number): React.JSX.Element {

    let Icon: React.JSX.Element = <></>;

    switch (true) {
        case value === 0: Icon = <TrendingUpDownIcon color="#cecece" />; break;
        case value > 0: Icon = <TrendingUpIcon color="#5fbf2f" />; break;
        case value < 0: Icon = <TrendingDownIcon color="#bf2f32" />; break;
    }

    return Icon;
}

function VolumeLabel({ value }: VolumeLabelProps) {

    const Icon = getTrendIcon(value);

    return (
        <div className="flex gap-4 items-center">
            {Icon}
            <b> <Digits value={value} /> </b>
        </div>
    );
}