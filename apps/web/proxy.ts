import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  // Allow all pages to load normally as per application logic
  return NextResponse.next();
}

// Matcher to run middleware on all paths except Next.js internals and assets
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

