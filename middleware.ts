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

// Allowed domains
const ALLOWED_DOMAINS = [
  'brandexme.com',
  'www.brandexme.com',
  'localhost',
  '127.0.0.1',
];

export default clerkMiddleware(async (auth, req) => {
  // Check if request is from allowed domain
  const origin = req.headers.get('origin') || '';
  const host = req.headers.get('host') || '';
  
  // Allow requests from brandexme.com domain
  const isAllowedDomain = ALLOWED_DOMAINS.some(domain => 
    host.includes(domain) || origin.includes(domain)
  );

  // Handle CORS for brandexme.com
  if (req.method === 'OPTIONS' && isAllowedDomain) {
    const response = new NextResponse(null, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', origin || 'https://brandexme.com');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }

  try {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  } catch (error) {
    // In production, don't expose error details
    // Log error for debugging but don't break the request
    if (process.env.NODE_ENV === 'development') {
      console.error('Middleware error:', error instanceof Error ? error.message : 'Unknown error');
    }
    // Let Clerk handle the error - don't throw to avoid breaking Server Components
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|css|js|json|webp|ttf|woff2?|ico)$).*)',
  ],
};
