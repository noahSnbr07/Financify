'use client';
import { useTrafficStream } from "@/src/hooks/use-traffic-stream";

export default function TrafficList() {

    const { logs, isConnected } = useTrafficStream();

    return (
        <div className="flex h-full flex-col gap-4">
            <TopOptions
                isConnected={isConnected}
                totalLogs={logs.length} />
            <div className="flex flex-col w-full border-2 border-stack rounded-lg h-full overflow-y-auto flex-1 p-4 gap-2">
                {logs.map((log) => (
                    <div
                        className="grid grid-cols-4"
                        key={log.timestamp}>
                        <b className="bg-stack rounded-sm px-2 py-1 w-32"> {log.method} </b>
                        <p className="text-sm text-foreground/50"> {log.timestamp} </p>
                        <p> {log.ip} </p>
                        <p> {log.path} </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TopOptions({ totalLogs, isConnected }: { totalLogs: number; isConnected: boolean; }) {

    return (
        <div className="grid p-4 gap-4 grid-cols-2 rounded-lg border-2 border-stack">
            <div className="flex items-center gap-2">
                <div className="bg-green-600 rounded-full size-2"></div>
                <b> {isConnected ? "Connected" : "Disconnected"} </b>
            </div>
            <b> Logs: {totalLogs} </b>

        </div>
    )
}