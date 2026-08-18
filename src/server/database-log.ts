import { database } from "../configuration";
import { LogType } from "../generated/prisma/enums"

type DatabaseLogType = LogType;

interface DatabaseLogProps {
    type: DatabaseLogType;
    message?: string;
    userId: string;
}

async function databaseLog({ type, userId, message = "<no message provided>" }: DatabaseLogProps) {

    const newLogData = { type, userId, message }

    const newLog = await database.log.create({
        data: newLogData,
    });

    console.log(`[NEW LOG ID]: ${newLog.id} - ${new Date().getDay()}`);
}

export default databaseLog;