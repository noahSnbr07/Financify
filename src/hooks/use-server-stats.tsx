import { useEffect, useState } from "react";
import { GetServerStats } from "../server/get-server-stats";

export function useServerStats(enabled = true) {
    const [stats, setStats] = useState<GetServerStats | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const eventSource = new EventSource("/api/admin/server-stats/stream");

        eventSource.onopen = () => {
            setIsConnected(true);
            setError(null);
        };

        eventSource.onmessage = (event) => {
            try {
                setStats(JSON.parse(event.data) as GetServerStats);
                setIsConnected(true);
                setError(null);
            } catch (parseError) {
                console.error("Failed to parse server stats:", parseError);
                setIsConnected(false);
                setError("Unable to connect to the server stats endpoint");
            }
        };

        eventSource.onerror = () => {
            setIsConnected(false);
            setError("Unable to connect to the server stats endpoint");
        };

        return () => eventSource.close();
    }, [enabled]);

    return { stats, isConnected, error };
}