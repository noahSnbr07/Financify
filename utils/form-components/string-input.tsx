'use client';

import { ChangeEvent } from "react";

interface StringInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
}

export default function StringInput({ value, onChange, placeholder, autoFocus = false, }: StringInputProps) {
    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <input
                value={value}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    onChange(event.target.value)
                }
                autoFocus={autoFocus}
                className="bg-stack p-4 rounded-sm"
                placeholder={placeholder}
                type="text"
            />
        </div>
    );
}