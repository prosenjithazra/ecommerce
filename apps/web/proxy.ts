import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that must bypass the Coming Soon redirect:
  // 1. /coming-soon itself
  // 2. /admin and all sub-routes
  // 3. /api and all sub-routes (for orders, auth, products, webhooks)
  // 4. Next.js internal static assets (_next/static, _next/image)
  // 5. Common public assets/images (logo, icon, favicon, etc.)
  if (
    pathname === '/coming-soon' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Redirect all other user-side requests to the coming-soon page
  const comingSoonUrl = request.nextUrl.clone();
  comingSoonUrl.pathname = '/coming-soon';
  return NextResponse.redirect(comingSoonUrl);
}

// Optimization: Matcher to run middleware on all paths except Next.js internals and assets
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
