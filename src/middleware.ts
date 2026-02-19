import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

/**
 * Add security headers to response
 * Implements OWASP recommended security headers for production
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
    // Content Security Policy - Prevents XSS, clickjacking, and other code injection attacks
    // Note: 'unsafe-inline' and 'unsafe-eval' needed for Next.js development
    const cspHeader = [
        "default-src 'self'",
        // Allow Vercel Analytics + Vercel Preview Feedback script injection
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://vercel.live https://*.vercel.live",
        "style-src 'self' 'unsafe-inline'", // Required for Next.js styled-jsx and CSS modules
        "img-src 'self' data: blob:", // Allow data URIs for inline images
        "font-src 'self' data:", // Allow data URIs for fonts
        "connect-src 'self' https://docs.google.com https://*.google.com https://*.googleusercontent.com https://vercel.live https://*.vercel.live", // Allow preview feedback network calls
        "frame-ancestors 'none'", // Prevent embedding (clickjacking protection)
        "base-uri 'self'", // Restrict base tag URLs
        "form-action 'self'", // Restrict form submissions
        "upgrade-insecure-requests", // Automatically upgrade HTTP to HTTPS
    ].join('; ');

    response.headers.set('Content-Security-Policy', cspHeader);

    // Prevent clickjacking by disallowing iframe embedding
    response.headers.set('X-Frame-Options', 'DENY');

    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');

    // Referrer Policy - Control information sent in Referer header
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions Policy - Restrict access to browser features
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    );

    // Strict-Transport-Security - Force HTTPS (only in production)
    if (process.env.NODE_ENV === 'production') {
        response.headers.set(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains; preload'
        );
    }

    // X-DNS-Prefetch-Control - Control DNS prefetching
    response.headers.set('X-DNS-Prefetch-Control', 'on');

    return response;
}

export default withAuth(
    function middleware(req) {
        try {
            const token = req.nextauth?.token as
                | {
                      mustChangePassword?: boolean;
                  }
                | undefined;
            
            if (req.nextUrl.pathname.startsWith("/activity/")) {
                console.log(`Middleware running for activity: ${req.nextUrl.pathname}`);
            }

            // Force password change flow
            const isResetPage = req.nextUrl.pathname.startsWith("/password-reset");
            if (token?.mustChangePassword && !isResetPage) {
                const url = req.nextUrl.clone();
                url.pathname = "/password-reset";
                const redirectResponse = NextResponse.redirect(url);
                return addSecurityHeaders(redirectResponse);
            }
            if (!token?.mustChangePassword && isResetPage) {
                const url = req.nextUrl.clone();
                url.pathname = "/dashboard";
                const redirectResponse = NextResponse.redirect(url);
                return addSecurityHeaders(redirectResponse);
            }

            // Return response with security headers
            const response = NextResponse.next();
            return addSecurityHeaders(response);
        } catch (error) {
            logger.error('Middleware error', error, {
                path: req.nextUrl.pathname,
            });
            // If middleware fails, allow request to continue (with security headers)
            const response = NextResponse.next();
            return addSecurityHeaders(response);
        }
    },
    {
        pages: {
            signIn: "/login",
        },
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/password-reset", "/activity/:path*"]
};
