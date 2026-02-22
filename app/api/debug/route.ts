import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value;
  return NextResponse.json({
    hasCookie: !!userId,
    userId: userId || null,
    allCookies: request.cookies.getAll().map(c => c.name),
  });
}
