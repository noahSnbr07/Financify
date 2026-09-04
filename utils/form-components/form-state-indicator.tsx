'use client';

interface _props {
    value: string,
    color?: string;
    label: string,
}

export default function FormStateIndicator({ value, color = "var(--stack)", label }: _props) {

    return (
        <div className="flex gap-2 items-center text-sm">
            <b className="text-foreground/50"> {label} </b>
            <b
                className="rounded-full px-3 py-1"
                style={{ background: color }}> {value} </b>
        </div>
    );
}