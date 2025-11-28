import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get the origin from the request
    const origin = request.headers.get('origin');
    const allowedOrigins = [
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'http://localhost:3000',
        'http://localhost:3001',
    ];

    // For API routes, add CORS and security headers
    if (request.nextUrl.pathname.startsWith('/api')) {
        // If there's an Origin header, validate it
        if (origin && !allowedOrigins.includes(origin)) {
            // Reject unauthorized cross-origin requests
            return new NextResponse(
                JSON.stringify({ 
                    error: 'CORS policy: Origin not allowed',
                    message: 'This API only accepts requests from authorized domains.'
                }),
                {
                    status: 403,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // Create response
        const response = NextResponse.next();

        // CORS Headers - Only allow same origin
        if (origin && allowedOrigins.includes(origin)) {
            response.headers.set('Access-Control-Allow-Origin', origin);
        } else if (!origin) {
            // Same-origin requests don't have Origin header
            response.headers.set('Access-Control-Allow-Origin', allowedOrigins[0]);
        }
        
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

        // Security Headers
        response.headers.set('X-DNS-Prefetch-Control', 'on');
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        response.headers.set('X-Frame-Options', 'SAMEORIGIN');
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        // Handle OPTIONS requests (preflight)
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, {
                status: 204,
                headers: response.headers,
            });
        }

        return response;
    }

    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        // Match all API routes
        '/api/:path*',
        // Match other routes except static files
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
