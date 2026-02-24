import { NextURL } from 'next/dist/server/web/next-url';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(_request: NextRequest): Promise<NextResponse> {

    return NextResponse.redirect(new NextURL("/dashboard", _request.url), 308);
}