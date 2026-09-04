'use client';

import FormStateIndicator from "./form-state-indicator";

interface _props {
    date: Date;
    onChange: (date: Date) => void;
}

function formatDateForInput(date: Date | string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    const year = parsedDate.getFullYear();
    const month = `${parsedDate.getMonth() + 1}`.padStart(2, "0");
    const day = `${parsedDate.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default function DatePicker({ date, onChange }: _props) {
    return (
        <div className="flex flex-col gap-4 p-4 bg-stack rounded-lg">
            <FormStateIndicator label="Select Date:" value={formatDateForInput(date)} />
            <input
                value={formatDateForInput(date)}
                type="date"
                onChange={(event) => {
                    const [year, month, day] = event.currentTarget.value.split("-").map(Number);
                    onChange(new Date(year, month - 1, day));
                }}
            />
        </div>
    );
}