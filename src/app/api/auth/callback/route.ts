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
    try {
      // First script
      const scriptTag1 = new shopify.rest.ScriptTag({ session });
      scriptTag1.src = 'https://dead-click-miner.vercel.app/collector2.js';
      scriptTag1.event = 'onload';
      scriptTag1.display_scope = 'online_store';
      await scriptTag1.save();

      // Second script  
      const scriptTag2 = new shopify.rest.ScriptTag({ session });
      scriptTag2.src = 'https://dead-click-miner.vercel.app/dead-click-highlighter.js';
      scriptTag2.event = 'onload';
      scriptTag2.display_scope = 'online_store';
      await scriptTag2.save();
    } catch (error) {
      console.error('Script tag creation failed:', error);
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