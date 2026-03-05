import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/products(.*)',
  '/category(.*)',
  '/home(.*)',
  '/api(.*)',
  '/intake(.*)',
  '/thank-you(.*)',
  '/cart(.*)',
  '/orders(.*)',
  '/terms-of-service',
  '/privacy-policy',
  '/refund-policy',
]);

const ALLOWED_DOMAINS = [
  'brandexme.com',
  'www.brandexme.com',
  'localhost',
  '127.0.0.1',
];

// Security headers required by PCI-DSS/OWASP/ISO 27001 — applied on every response from middleware
const CSP =
  "default-src 'self'; frame-ancestors 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.com https://*.clerk.dev https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://*.clerk.dev https://www.google-analytics.com https://vitals.vercel-insights.com https://va.vercel-scripts.com; object-src 'none'; base-uri 'self'; form-action 'self'";

function setSecurityHeaders(response: NextResponse): void {
  response.headers.set('Content-Security-Policy', CSP);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
}

export default clerkMiddleware(async (auth, req) => {
  const origin = req.headers.get('origin') || '';
  const host = req.headers.get('host') || '';

  const isAllowedDomain = ALLOWED_DOMAINS.some(domain =>
    host.includes(domain) || origin.includes(domain)
  );

  // Handle CORS for OPTIONS requests
  if (req.method === 'OPTIONS' && isAllowedDomain) {
    const response = new NextResponse(null, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', origin || 'https://brandexme.com');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    setSecurityHeaders(response);
    return response;
  }

  // Protect non-public routes — Clerk handles the redirect for unauthenticated users
  // and automatically includes a redirect_url param so they return after sign-in
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // Geo Detection — set country cookie for currency/localization
  const country = req.headers.get('x-vercel-ip-country');
  if (country) {
    const response = NextResponse.next();
    response.cookies.set('user-country', country, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax'
    });
    setSecurityHeaders(response);
    return response;
  }

  // Ensure security headers on all other responses (e.g. GET /)
  const response = NextResponse.next();
  setSecurityHeaders(response);
  return response;
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|css|js|json|webp|ttf|woff2?|ico)$).*)',
  ],
};
