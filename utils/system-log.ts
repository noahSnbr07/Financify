import { appendFile } from "fs/promises";
import { join } from "path";

export enum SystemLogGroup {
    billing = "billing"
}

async function systemLog(message: string, group: SystemLogGroup, omitTimeStamp: boolean | null = false): Promise<void> {

    try {
        const timestamp = new Date().toISOString();
        const logMessage = `${!omitTimeStamp ? `-----<[${timestamp}]>-----\n` : ""}${message}\n`;
        const logPath = join(process.cwd(), "logs", `${group}.log`);

        await appendFile(logPath, logMessage, { encoding: "utf-8" });
    } catch (error) {
        console.error('Failed to write to logs.log:', error);
    }
}

export default systemLog;