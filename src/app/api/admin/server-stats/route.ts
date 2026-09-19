import getServerStats from "@/src/server/get-server-stats";
import { UserRole } from "@/src/generated/prisma/enums";
import { getAuth } from "@/src/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    const auth = await getAuth();
    if (!auth || auth.role !== UserRole.admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getServerStats(auth);
    if (!stats) {
        return NextResponse.json({ error: "Unable to load server stats" }, { status: 503 });
    }

    return NextResponse.json(stats, {
        headers: {
            "Cache-Control": "no-store",
        },
    });
}
