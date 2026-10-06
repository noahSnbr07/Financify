import { redis } from "@/src/static/rate-limit-preset";
import { NextRequest } from "next/server";

const ignoredPaths: string[] = ["/api/resource/download", "/api/authentication/get-state"];

export async function writeTrafficLogToRedis({ request }: { request: NextRequest }): Promise<void> {

    if (!redis) return;
    if (ignoredPaths.includes(request.nextUrl.pathname)) return;


    const logEntry = {
        timestamp: new Date().toISOString(),
        method: request.method,
        path: request.nextUrl.pathname,
        ip: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown"
    }

    try {

        await redis.lpush("proxy:traffic", JSON.stringify(logEntry));

        await redis.ltrim("proxy:traffic", 0, 500);

        await redis.publish("proxy:traffic:live", JSON.stringify(logEntry));

    } catch (error) {
        console.error("Failed to log traffic:", error);
    }
}