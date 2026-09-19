import os from "node:os";
import { UserRole } from "../generated/prisma/enums";
import getAuth from "./get-auth";
import type { User } from "../interfaces";
import { formatBytes, formatCpu, formatUptime } from "@/utils/functions/formatters";

export interface GetServerStats {
    os: {
        release: string;
        freeMemory: string;
        uptime: string;
        version: string;
        cores: string;
    },
    resources: {
        cpu: string;
        memory: string;
        memoryRSS: string;
    },
    node: {
        lts: string;
        version: string;
        name: string;
        environment: string;
    }
    general: {
        processId: number;
        uptime: string;
        availableMemory: string;
        platform: string;
        cpuArchitecture: string;
    }
}

async function getServerStats(auth?: User): Promise<GetServerStats | null> {
    const authenticatedUser = auth ?? await getAuth();
    if (!authenticatedUser || authenticatedUser.role !== UserRole.admin) return null;

    const resources = process.resourceUsage();
    const memoryUsage = process.memoryUsage().heapTotal;
    const memoryRSS = process.memoryUsage().rss;
    const uptime = process.uptime();
    const availableMemory = os.freemem();
    const nodeVersion = process.version;
    const processId = process.pid;
    const platform = process.platform;
    const cpuArchitecture = process.arch;
    const nodeLTS = process.release.lts || "Unknown";
    const nodeName = process.release.name || "Unknown";
    const environment = process.env.NODE_ENV;
    const osRelease = os.release();
    const osFreeMemory = os.freemem();
    const osUptime = os.uptime();
    const osVersion = os.version();
    const osCores = os.cpus().length;

    return {
        os: {
            release: osRelease,
            freeMemory: formatBytes(osFreeMemory),
            cores: String(osCores),
            uptime: formatUptime(osUptime),
            version: osVersion,
        },
        general: {
            processId,
            availableMemory: formatBytes(availableMemory),
            cpuArchitecture,
            platform,
            uptime: formatUptime(uptime),
        },
        node: {
            lts: nodeLTS,
            version: nodeVersion,
            name: nodeName,
            environment
        },
        resources: {
            memoryRSS: formatBytes(memoryRSS),
            cpu: formatCpu(resources.userCPUTime + resources.systemCPUTime),
            memory: formatBytes(memoryUsage),
        }
    };
}

export default getServerStats;