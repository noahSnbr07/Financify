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
            let closed = false;
            const heartbeat = setInterval(() => {
                if (!closed) controller.enqueue(encoder.encode(": heartbeat\n\n"));
            }, 15000);

            const closeStream = async () => {
                if (closed) return;
                closed = true;
                clearInterval(heartbeat);
                if (subscriber.isOpen) await subscriber.disconnect();
                controller.close();
            };

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
                    if (closed) return;

                    try {
                        const data = `data: ${message}\n\n`;
                        controller.enqueue(encoder.encode(data));
                    } catch (error) {
                        console.error("Streaming error:", error);
                        void closeStream();
                    }
                });
            } catch (error) {
                console.error("Redis subscriber connection failed:", error);
                await closeStream();
            }

            // Cleanup on disconnect
            request.signal.addEventListener("abort", () => void closeStream(), { once: true });
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    });
}