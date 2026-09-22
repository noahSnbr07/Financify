import getServerStats from "@/src/server/get-server-stats";
import { UserRole } from "@/src/generated/prisma/enums";
import { getAuth } from "@/src/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const auth = await getAuth();
    if (!auth || auth.role !== UserRole.admin) {
        return new Response("Unauthorized", { status: 401 });
    }

    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            let streamClosed = false;

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

            // Initial send
            void sendStats();

            const interval = setInterval(sendStats, 1000);

            request.signal.addEventListener("abort", () => {
                if (streamClosed) return;
                streamClosed = true;
                clearInterval(interval);
                controller.close();
            });
        }
    });

    return new NextResponse(stream, {
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
            "X-Content-Type-Options": "nosniff",
            "Transfer-Encoding": "chunked",
        }
    });
}