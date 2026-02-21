import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';

function verifySignature(rawBody: string, signature: string): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(rawBody).digest('hex');

  // timingSafeEqual throws if lengths differ, so check first
  const sigBuf = Buffer.from(signature);
  const digestBuf = Buffer.from(digest);
  if (sigBuf.length !== digestBuf.length) return false;

  return crypto.timingSafeEqual(sigBuf, digestBuf);
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature') || '';

    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const eventName = payload?.meta?.event_name;
    const customData = payload?.meta?.custom_data;
    const userId = customData?.user_id;

    if (!userId) {
      console.error('No user_id in webhook custom data');
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
    }

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated': {
        const status = payload?.data?.attributes?.status;
        // active, on_trial, past_due -> pro; cancelled, expired, unpaid -> free
        const tier = ['active', 'on_trial', 'past_due'].includes(status) ? 'pro' : 'free';
        await db.updateUser(userId, { subscription_tier: tier });
        break;
      }
      case 'subscription_cancelled':
      case 'subscription_expired': {
        await db.updateUser(userId, { subscription_tier: 'free' });
        break;
      }
      default:
        console.log('Unhandled webhook event:', eventName);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
