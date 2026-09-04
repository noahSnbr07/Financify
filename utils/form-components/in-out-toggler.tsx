"use client";

import { CSSProperties } from "react";
import FormStateIndicator from "./form-state-indicator";

interface _props {
    out: boolean;
    onChange: (out: boolean) => void;
}

export default function InOutSwitch({ out, onChange }: _props) {

    const baseClassName: string = "flex-1 border-2 border-foreground/50 rounded-md py-2 font-bold";

    const styles: { active: CSSProperties, inactive: CSSProperties, } = {
        active: { background: "var(--color-foreground)", color: "var(--color-background)" },
        inactive: { background: "var(--color-background)", color: "var(--color-foreground)" },
    }

    console.log(out)

    return (
        <div className="flex flex-col gap-4 p-4 rounded-lg bg-stack">
            <FormStateIndicator label="Select Direction:" value={out ? "out" : "in"} />
            <div className="flex gap-x-4">
                <button
                    style={out ? styles.active : styles.inactive}
                    className={baseClassName}
                    onClick={() => onChange(true)} > Out </button>
                <button
                    style={!out ? styles.active : styles.inactive}
                    className={baseClassName}
                    onClick={() => onChange(false)} > In </button>
            </div>
        </div>
    );
}