import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import Stripe from 'stripe';

let _stripe: Stripe;
function getStripe() {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-01-28.clover' });
  return _stripe;
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.getUserById(userId);
    if (!user || !user.stripe_customer_id) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 });
    }

    // Create customer portal session
    const session = await getStripe().billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://recurringtasks-notion.vercel.app'}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}
