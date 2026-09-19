'use client';

interface _props {
    label: string;
    value: string;
}

export default function InfoCard({ label, value }: _props) {

    return (
        <div
            className="flex flex-col p-4 gap-4 rounded-lg bg-stack"
        >
            <b> {label} </b>
            <b className="text-xl font-black text-green-600 w-full text-right bg-stack p-2 rounded-sm truncate"> {value} </b>
        </div>
    );
}