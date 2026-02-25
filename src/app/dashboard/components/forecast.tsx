'use client';

import { GetForecastProps } from "@/src/server/get-forecast";

interface _props {
    forecast: GetForecastProps;
}

export default function Forecast({ forecast }: _props) {

    const { nextWeek, nextMonth, nextYear } = forecast;

    return (
        <div className="flex flex-col gap-1 px-2">
            <ForecastRow label="Next Week" value={nextWeek} />
            <ForecastRow label="Next Month" value={nextMonth} />
            <ForecastRow label="Next Year" value={nextYear} />
        </div>
    );
}

function ForecastRow({ label, value }: { label: string; value: number }) {

    return (
        <div className="flex w-full items-center">
            <p className="flex-1 text-foreground/50"> {label} </p>
            <b className="bg-stack rounded-sm py-1 px-4 w-1/3"> ${value} </b>
        </div>
    );
}