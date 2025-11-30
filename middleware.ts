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

  // Geo Detection
  const country = req.headers.get('x-vercel-ip-country');
  let response = NextResponse.next();

  // If we have a country header, we might want to pass it down or set a cookie
  // However, with Clerk middleware, we need to be careful about the response object.
  // Clerk's auth.protect() might redirect.

  try {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Middleware error:', error instanceof Error ? error.message : 'Unknown error');
    }
    // If auth fails, it usually redirects, so we might not be able to set the cookie easily here
    // unless we intercept the redirect response. 
    // But for public routes (which is most of the store), we can set the cookie.
  }

  // If the request is processed successfully (no redirect from auth.protect yet),
  // we can try to set the cookie on the response.
  // Note: If auth.protect() redirects, this part might not be reached or the response might be overridden.
  // Ideally, we set the cookie on the response that is returned.

  if (country) {
    // We need to ensure we are attaching this cookie to the response that will be sent.
    // Since Clerk middleware wraps the handler, we might need to return the response explicitly if we modify it.
    // But Clerk middleware signature is (auth, req) => void | Response.

    // Let's create a response if one hasn't been created (e.g. by auth.protect redirecting)
    // Actually, if auth.protect() doesn't throw, we proceed.

    // We can't easily modify the response *after* auth.protect() if it doesn't return one.
    // But we can set the cookie on the request headers for downstream? No, we want client to see it.

    // Let's use a simpler approach: Set the cookie if it's missing.
    // But we can't set a cookie on the *request*. We set it on the *response*.

    // If we return a response, we stop the chain? No, Clerk middleware allows returning a response.
    // Let's just set the cookie on the response object we created earlier or create a new one.

    // Re-creating the response logic:
    if (!response) {
      response = NextResponse.next();
    }

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
