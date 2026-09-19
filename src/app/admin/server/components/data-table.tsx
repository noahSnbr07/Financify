'use client';
import { useServerStats } from "@/src/hooks/use-server-stats";
import InfoCard from "./info-card";

export default function DataTable() {

    const { stats, isConnected, error } = useServerStats();
    if (!stats) return <p className="m-8 w-full text-center">{error ?? "fetching data ..."}</p>;
    const { general, node, os, resources } = stats;

    return (
        <>
            <div className="flex gap-2 items-center">
                <div className="size-2 bg-green-600 rounded-full"> </div>
                <p className="text-foreground/50"> {isConnected ? "Connected" : "Disconnected"} </p>
            </div>
            <b className="text-xl"> Live Server Metrics </b>
            <div className="flex flex-col gap-4">
                <hr className="border-stack rounded-full border-2" />
                <p> VPS </p>
                <div className="grid grid-cols-4 gap-4">
                    <InfoCard label={"Available Memory"} value={general.availableMemory} />
                    <InfoCard label={"CPU Arch"} value={general.cpuArchitecture} />
                    <InfoCard label={"Platform"} value={general.platform} />
                    <InfoCard label={"Process ID"} value={String(general.processId)} />
                    <InfoCard label={"Uptime"} value={general.uptime} />
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <hr className="border-stack rounded-full border-2" />
                <p> Operating System </p>
                <div className="grid grid-cols-4 gap-4">
                    <InfoCard label={"CPU Cores"} value={os.cores} />
                    <InfoCard label={"Free Memory"} value={os.freeMemory} />
                    <InfoCard label={"Release"} value={os.release} />
                    <InfoCard label={"Uptime"} value={os.uptime} />
                    <InfoCard label={"Version"} value={os.version} />
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <hr className="border-stack rounded-full border-2" />
                <p> Runtime </p>
                <div className="grid grid-cols-4 gap-4">
                    <InfoCard label={"LTS"} value={node.lts} />
                    <InfoCard label={"Name"} value={node.name} />
                    <InfoCard label={"Version"} value={node.version} />
                    <InfoCard label={"Environment"} value={node.environment} />
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <hr className="border-stack rounded-full border-2" />
                <p> Resources </p>
                <div className="grid grid-cols-4 gap-4">
                    <InfoCard label={"CPU Time"} value={resources.cpu} />
                    <InfoCard label={"RAM Usage"} value={resources.memory} />
                    <InfoCard label={"RSS Usage"} value={resources.memoryRSS} />
                </div>
            </div>
        </>
    );
}