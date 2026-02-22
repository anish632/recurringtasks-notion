import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=${error}`);
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(
          `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
        ).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.NOTION_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const errBody = await tokenResponse.text();
      console.error('Token exchange failed:', tokenResponse.status, errBody);
      throw new Error(`Token exchange ${tokenResponse.status}: ${errBody}`);
    }

    const tokenData = await tokenResponse.json();

    // Store user in database
    const user = await db.createUser({
      notion_access_token: tokenData.access_token,
      notion_bot_id: tokenData.bot_id,
      notion_workspace_id: tokenData.workspace_id,
      notion_workspace_name: tokenData.workspace_name || 'My Workspace',
      subscription_tier: 'free',
    });

    // Return an HTML page that sets the cookie via meta-refresh redirect
    // This ensures the cookie is set on a 200 response (not a 3xx redirect),
    // which is more reliable across browsers.
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
    const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${dashboardUrl}"></head><body>Redirecting...</body></html>`;
    
    const response = new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
    response.cookies.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error('OAuth error:', error?.message || error);
    const errorMsg = encodeURIComponent(error?.message || 'unknown');
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}?error=oauth_failed&detail=${errorMsg}`
    );
  }
}
