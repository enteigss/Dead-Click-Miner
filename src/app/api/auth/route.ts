import { NextRequest, NextResponse } from 'next/server';
import shopify from '@/lib/shopify';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get('shop');
  const host = searchParams.get('host');

  if (!shop) {
    return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 });
  }

  try {
    const authRoute = await shopify.auth.begin({
      shop: shop as string,
      callbackPath: '/api/auth/callback',
      isOnline: false,
      rawRequest: request,
      rawResponse: new Response(),
    });

    return NextResponse.redirect(authRoute);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}