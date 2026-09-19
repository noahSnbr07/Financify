import { UserRole } from "@/src/generated/prisma/enums";
import { getAuth } from "@/src/server";
import { apiResponsePresets } from "@/src/static";
import { NextResponse } from "next/server";

import { createClient } from "redis";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {

    const auth = await getAuth();
    if (!auth || auth.role !== UserRole.admin) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();

            // Create Redis subscriber for this connection
            const subscriber = createClient({
                socket: {
                    host: process.env.REDIS_HOST || "localhost",
                    port: Number(process.env.REDIS_PORT || 6379),
                    reconnectStrategy: false,
                },
            });

            subscriber.on("error", (err) => {
                console.error("Redis error:", err);
            });

            try {
                await subscriber.connect();

                // Subscribe to live traffic channel
                await subscriber.subscribe("proxy:traffic:live", (message) => {
                    try {
                        const data = `data: ${message}\n\n`;
                        controller.enqueue(encoder.encode(data));
                    } catch (error) {
                        console.error("Streaming error:", error);
                        controller.close();
                    }
                });
            } catch (error) {
                console.error("Redis subscriber connection failed:", error);
                controller.close();
            }

            // Cleanup on disconnect
            request.signal.addEventListener("abort", async () => {
                if (subscriber.isOpen) await subscriber.disconnect();
                controller.close();
            });
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        }
    });
}