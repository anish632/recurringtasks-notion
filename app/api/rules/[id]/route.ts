import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateNextRun } from '@/lib/scheduler';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const existing = await db.getRuleById(id);
    if (!existing || existing.user_id !== userId) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {};

    if (body.is_active !== undefined) {
      updates.is_active = body.is_active;
    }

    if (body.schedule_type || body.schedule_value) {
      updates.schedule_type = body.schedule_type;
      updates.schedule_value = body.schedule_value;
      updates.next_run = calculateNextRun({
        schedule_type: body.schedule_type,
        schedule_value: body.schedule_value,
      } as any);
    }

    const rule = await db.updateRule(id, updates);

    return NextResponse.json({ rule });
  } catch (error) {
    console.error('Error updating rule:', error);
    return NextResponse.json(
      { error: 'Failed to update rule' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const existing = await db.getRuleById(id);
    if (!existing || existing.user_id !== userId) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }

    await db.deleteRule(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting rule:', error);
    return NextResponse.json(
      { error: 'Failed to delete rule' },
      { status: 500 }
    );
  }
}
