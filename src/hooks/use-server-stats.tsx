import { useEffect, useState } from "react";
import { GetServerStats } from "../server/get-server-stats";

export function useServerStats(enabled = true) {
    const [stats, setStats] = useState<GetServerStats | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) return;

        let stopped = false;
        let timeout: ReturnType<typeof setTimeout> | undefined;
        const controller = new AbortController();

        const fetchStats = async () => {
            try {
                const response = await fetch("/api/admin/server-stats", {
                    cache: "no-store",
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Server stats request failed: ${response.status}`);
                }

                const data = await response.json() as GetServerStats;
                if (stopped) return;

                setStats(data);
                setIsConnected(true);
                setError(null);
            } catch (requestError) {
                if (stopped || controller.signal.aborted) return;

                console.error("Failed to fetch server stats:", requestError);
                setIsConnected(false);
                setError("Unable to connect to the server stats endpoint");
            } finally {
                if (!stopped) timeout = setTimeout(fetchStats, 1000);
            }
        };

        fetchStats();

        return () => {
            stopped = true;
            controller.abort();
            if (timeout) clearTimeout(timeout);
        };
    }, [enabled]);

    return { stats, isConnected, error };
}