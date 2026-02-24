'use client';

import { ChangeEvent, useState, useRef, useEffect } from "react";
import Message, { MessageProps } from "./message";
import { APIResponse } from "@/src/interfaces";
import { SendHorizontalIcon, Server } from "lucide-react";

export default function Chat() {

    const [messages, setMessages] = useState<MessageProps[]>([]);
    const [prompt, setPrompt] = useState<string>("");
    const [pending, setPending] = useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function sendMessage() {
        // add user message
        setPending(true);
        setMessages(prev => [...prev, { content: prompt, id: messages.length, sender: "user", timeStamp: new Date() }]);

        const temporaryPrompt = prompt;
        setPrompt("");
        // call API
        const response = await fetch("/api/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: temporaryPrompt })
        });

        const data: APIResponse<string> = await response.json();

        if (data.success && response.ok) {
            setMessages(prev => [
                ...prev,
                {
                    content: data.data,
                    id: Date.now(),
                    sender: "bot",
                    timeStamp: new Date()
                }
            ]);
        }

        setPending(false);
    }

    return (
        <div className="flex flex-1 h-full flex-col gap-4">
            <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
                {messages.map((message) => <Message key={message.id} {...message} />)}
                <div ref={messagesEndRef} />
            </div>

            <LoadingIndicator pending={pending} />

            <div className="flex gap-4 p-2">
                <input
                    onKeyDown={(event) => { if (event.key == "Enter") sendMessage() }}
                    value={prompt}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setPrompt(event.target.value)}
                    type="text"
                    placeholder="Chat Prompt"
                    className="flex-1 bg-stack rounded-md p-2" />
                <button
                    disabled={pending}
                    style={{ opacity: pending ? .5 : 1 }}
                    onClick={sendMessage}
                    className="bg-foreground size-10 rounded-full flex justify-center items-center"
                >
                    <SendHorizontalIcon color="var(--background)" size={20} />
                </button>
            </div>
        </div>
    );
}

function LoadingIndicator({ pending }: { pending: boolean }) {

    if (!pending) return null;

    return (
        <div className="w-full flex gap-4 p-4 items-center justify-center">
            <Server opacity={.5} size={20} />
            <b className="text-foreground/50"> Server is generating a response ... </b>
        </div>
    )
}