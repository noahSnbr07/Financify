'use client';

interface _props {
    content: string;
    sender: "user" | "bot";
    timeStamp: Date;
}

export interface MessageProps extends _props {
    id: number;
}

export default function Message({ content, sender, timeStamp }: _props) {

    return (
        <div
            style={{
                border: sender === "bot" ? "2px solid var(--stack)" : "none",
                background: sender === "bot" ? "var(--background)" : "var(--foreground)",
                color: sender !== "bot" ? "var(--background)" : "var(--foreground)",
                borderRadius: sender === "bot" ? "20px 20px 20px 4px" : "20px 20px 4px 20px"
            }}
            className="flex flex-col gap-2 p-4 bg-stack"
        >
            <b> {sender == "bot" ? "Financify Assistant" : "User"} </b>
            <p> {content} </p>
            <i className="text-sm opacity-50 text-right"> {timeStamp.toLocaleTimeString()} </i>
        </div>
    );
}