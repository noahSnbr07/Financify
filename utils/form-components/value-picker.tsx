'use client';

import { ChangeEvent, } from "react";
import FormStateIndicator from "./form-state-indicator";

interface _props {
    value: number;
    onChange: (value: number) => void;
}
export default function ValuePicker({ onChange, value }: _props) {


    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <FormStateIndicator label="Select Value:" value={String(value)} />
            <input
                value={value}
                onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(Number(event.target.value))}
                className="w-full p-4 bg-stack rounded-sm text-center text-3xl font-bold"
                type="number" />
        </div>
    );
}