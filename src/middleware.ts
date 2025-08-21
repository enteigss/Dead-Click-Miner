import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Handle Shopify embedded app requirements
  if (request.headers.get('sec-fetch-dest') === 'iframe') {
    // Allow iframe embedding from Shopify
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'ALLOWALL');
    response.headers.set('Content-Security-Policy', "frame-ancestors 'self' https://*.shopify.com https://admin.shopify.com");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};