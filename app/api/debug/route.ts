import { NextResponse } from 'next/server';

export async function GET() {
  const secret = process.env.NOTION_CLIENT_SECRET || 'NOT_SET';
  return NextResponse.json({
    secretPrefix: secret.substring(0, 12) + '...',
    secretLength: secret.length,
    redirectUri: process.env.NOTION_REDIRECT_URI,
    clientId: process.env.NOTION_CLIENT_ID,
  });
}
