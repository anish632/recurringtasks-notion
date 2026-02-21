import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserDatabases } from '@/lib/notion';

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const databases = await getUserDatabases(user.notion_access_token);

    return NextResponse.json({ databases });
  } catch (error: any) {
    console.error('Error fetching databases:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch databases', detail: error?.message },
      { status: 500 }
    );
  }
}
