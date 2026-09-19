import { useEffect, useState } from "react";

interface TrafficLog {
    timestamp: string;
    method: string;
    path: string;
    status: number;
    duration: number;
    ip: string;
}

export function useTrafficStream() {
    const [logs, setLogs] = useState<TrafficLog[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        fetch("/api/admin/traffic/history")
            .then((res) => res.json())
            .then((data) => setLogs(data))
            .catch((error) => console.error("Failed to fetch history:", error));

        const eventSource = new EventSource("/api/admin/traffic/stream");

        eventSource.onopen = () => setIsConnected(true);
        eventSource.onmessage = (e) => {
            try {
                const newLog = JSON.parse(e.data);
                setLogs((prev) => [newLog, ...prev].slice(0, 100));
            } catch (error) {
                console.error("Parse error:", error);
            }
        };
        eventSource.onerror = () => {
            setIsConnected(false);
            eventSource.close();
        };

        return () => eventSource.close();
    }, []);

    return { logs, isConnected };
}