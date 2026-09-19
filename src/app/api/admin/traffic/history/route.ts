import { UserRole } from "@/src/generated/prisma/enums";
import { getAuth } from "@/src/server";
import { apiResponsePresets } from "@/src/static";
import { redis } from "@/src/static/rate-limit-preset";
import { NextResponse } from "next/server";

export async function GET() {

    const auth = await getAuth();
    if (!auth || auth.role !== UserRole.admin) return NextResponse.json(apiResponsePresets.UNAUTHORIZED());

    if (!redis) {
        return NextResponse.json([], { status: 200 });
    }

    try {
        const history = await redis.lrange("proxy:traffic", 0, 99);
        const requests = history.map((item) => JSON.parse(item));
        return Response.json(requests);
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}