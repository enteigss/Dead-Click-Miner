import { NextRequest, NextResponse } from 'next/server';
import shopify from '@/lib/shopify';

export async function GET(request: NextRequest) {
  try {
    const callbackResponse = await shopify.auth.callback({
      rawRequest: request,
      rawResponse: new Response(),
    });

    const { session } = callbackResponse;
    
    if (!session) {
      return NextResponse.json({ error: 'No session created' }, { status: 400 });
    }

    // Store session (in production, use a proper session storage)
    // For now, redirect to the main app
    const url = new URL('/', request.url);
    url.searchParams.set('shop', session.shop);
    url.searchParams.set('host', request.nextUrl.searchParams.get('host') || '');

    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json({ error: 'Callback failed' }, { status: 500 });
  }
}