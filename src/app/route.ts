
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

/* import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {

    console.log("URL:", request.url);
    console.log("HOST:", request.headers.get("host"));
    console.log("X-FORWARDED-HOST:", request.headers.get("x-forwarded-host"));
    console.log("X-FORWARDED-PROTO:", request.headers.get("x-forwarded-proto"));

    return NextResponse.redirect(new URL("/dashboard", request.url), 308);
} */

/* import { NextResponse, NextRequest } from 'next/server';

export async function GET(_request: NextRequest): Promise<NextResponse> {

    return NextResponse.redirect(new URL("/dashboard", _request.url), 308);
} */