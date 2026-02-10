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
  '/thank-you(.*)',
  '/cart(.*)',
  '/orders(.*)',
  '/terms-of-service',
  '/privacy-policy',
]);

const ALLOWED_DOMAINS = [
  'brandexme.com',
  'www.brandexme.com',
  'localhost',
  '127.0.0.1',
];

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
    return response;
  }
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|css|js|json|webp|ttf|woff2?|ico)$).*)',
  ],
};
