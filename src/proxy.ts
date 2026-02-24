import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@/src/server'

export default async function proxy(request: NextRequest): Promise<NextResponse> {

    const token = request.cookies.get('financify-token')?.value;
    if (!token) return NextResponse.redirect(new URL('/authentication', request.url));

    const auth = await getAuth(token);
    if (!auth) return NextResponse.redirect(new URL('/authentication', request.url));

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard",
        "/me",
        "/transactions/new",
        "/transactions/history",
        "/accounts/new",
        "/categories/new",
        "/me",
    ],
}