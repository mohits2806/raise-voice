import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware doesn't do anything specific yet but can be extended
// for protected routes or API authentication in the future
export function middleware(request: NextRequest) {
    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
