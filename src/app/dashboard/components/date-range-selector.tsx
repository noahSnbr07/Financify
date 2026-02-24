"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DateRangeOption {
    id: number,
    label: string;
    value: number;
    active: boolean;
}

function DateRangeSelector() {

    const [rangeOptions, setRangeOptions] = useState<DateRangeOption[]>([
        { id: 0, label: "Today", value: 1, active: false },
        { id: 1, label: "Week", value: 7, active: false },
        { id: 2, label: "Month", value: 30, active: false },
        { id: 3, label: "Quarter", value: 90, active: false },
        { id: 4, label: "All-Time", value: 0, active: true },
    ]);

    const router = useRouter();

    function updateRange(argumentOption: DateRangeOption) {
        const newRangeOptions = rangeOptions.map(function (option) {
            return { ...option, active: argumentOption.id === option.id }
        });

        setRangeOptions(newRangeOptions);
        router.push(`/dashboard?range=${argumentOption.value}`);
    }

    return (
        <div
            className="bg-stack rounded-md flex gap-1 p-1"
        >
            {rangeOptions.map(function (option) {

                return (
                    <button
                        className="p-1 flex-1 rounded-sm font-bold"
                        key={option.id}
                        onClick={() => updateRange(option)}
                        style={{
                            background: `var(--${option.active ? "foreground" : "background"})`,
                            color: `var(--${!option.active ? "foreground" : "background"})`,
                        }}>
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}

export default DateRangeSelector;