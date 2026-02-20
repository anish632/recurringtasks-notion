import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateNextRun } from '@/lib/scheduler';

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rules = await db.getRulesByUserId(userId);

    return NextResponse.json({ rules });
  } catch (error) {
    console.error('Error fetching rules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rules' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check subscription limits
    const existingRules = await db.getRulesByUserId(userId);
    if (user.subscription_tier === 'free' && existingRules.length >= 3) {
      return NextResponse.json(
        { error: 'Free plan limited to 3 rules. Upgrade to Pro for unlimited.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { database_id, database_name, template_page_id, schedule_type, schedule_value } = body;

    if (!database_id || !schedule_type || !schedule_value) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const rule = await db.createRule({
      user_id: userId,
      database_id,
      database_name: database_name || 'Untitled Database',
      template_page_id,
      schedule_type,
      schedule_value,
      next_run: calculateNextRun({
        schedule_type,
        schedule_value,
      } as any),
      is_active: true,
    });

    return NextResponse.json({ rule }, { status: 201 });
  } catch (error) {
    console.error('Error creating rule:', error);
    return NextResponse.json(
      { error: 'Failed to create rule' },
      { status: 500 }
    );
  }
}
