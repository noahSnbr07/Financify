'use client';

import { colors } from "@/src/assets";
import FormStateIndicator from "./form-state-indicator";

interface _props {
    color: string;
    onChange: (color: string) => void;
}

export default function ColorSelector({ color, onChange }: _props) {

    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <FormStateIndicator label="Select Color:" value={color} color={color} />
            <div className="grid grid-cols-4 gap-4">
                {colors.map(function (indexedColor) {
                    return (
                        <button
                            key={indexedColor.id}
                            onClick={() => onChange(indexedColor.hsl)}
                            style={{
                                background: indexedColor.hsl,
                                border: `4px solid ${color === indexedColor.hsl ? "var(--foreground)" : "transparent"}`
                            }}
                            className="rounded-sm aspect-square font-bold text-sm"
                        >
                            {indexedColor.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}