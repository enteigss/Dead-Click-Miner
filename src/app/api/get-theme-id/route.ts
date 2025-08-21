import { NextRequest, NextResponse } from 'next/server';
import shopify from '@/lib/shopify';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Get session token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const sessionToken = authHeader.replace('Bearer ', '');
    
    // Verify the JWT token
    const payload = jwt.verify(sessionToken, process.env.SHOPIFY_API_SECRET!) as any;
    const shop = payload.dest.replace('https://', '').replace('/', '');

    // Get stored access token for this shop (you'll need to implement session storage)
    // For now, we'll need to get it from the OAuth callback storage
    const storedSession = global.shopifySessions?.[shop];
    
    if (!storedSession) {
      return NextResponse.json({ error: 'No stored session found for shop' }, { status: 401 });
    }

    const themes = await shopify.rest.Theme.all({ session: storedSession });
    const publishedTheme = themes.data.find(theme => theme.role === 'main');

    if (!publishedTheme) {
      return NextResponse.json({ error: 'No published theme found' }, { status: 404 });
    }

    return NextResponse.json({ themeId: publishedTheme.id });
  } catch (error) {
    console.error('Failed to fetch theme ID:', error);
    return NextResponse.json({ error: 'Failed to fetch theme ID' }, { status: 500 });
  }
}