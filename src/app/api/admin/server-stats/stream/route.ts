import getServerStats from "@/src/server/get-server-stats";
import { UserRole } from "@/src/generated/prisma/enums";
import { getAuth } from "@/src/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const auth = await getAuth();
    if (!auth || auth.role !== UserRole.admin) {
        return new Response("Unauthorized", { status: 401 });
    }

    // Create a readable stream
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            let streamClosed = false;

            // Force the first SSE chunk through reverse proxies that buffer small responses.
            controller.enqueue(encoder.encode(`:${" ".repeat(2048)}\n\n`));

            const sendStats = async () => {
                if (streamClosed) return;

                try {
                    const stats = await getServerStats(auth);
                    if (!stats) return;

                    const data = `data: ${JSON.stringify(stats)}\n\n`;
                    controller.enqueue(encoder.encode(data));
                } catch (error) {
                    console.error("Stats streaming error:", error);
                    streamClosed = true;
                    controller.close();
                }
            };

            await sendStats();
            const interval = setInterval(sendStats, 1000);
            const heartbeat = setInterval(() => {
                if (!streamClosed) controller.enqueue(encoder.encode(": heartbeat\n\n"));
            }, 15000);

            // Cleanup on client disconnect
            request.signal.addEventListener("abort", () => {
                streamClosed = true;
                clearInterval(interval);
                clearInterval(heartbeat);
                controller.close();
            });
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