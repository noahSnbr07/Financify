import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const host =
        request.headers.get("x-forwarded-host") ??
        request.headers.get("host");

    const protocol =
        request.headers.get("x-forwarded-proto") ??
        "https";

    return NextResponse.redirect(
        `${protocol}://${host}/dashboard`,
        308
    );
}