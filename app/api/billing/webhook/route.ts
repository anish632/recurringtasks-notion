import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import Stripe from 'stripe';

let _stripe: Stripe;
function getStripe() {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-01-28.clover' });
  return _stripe;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;

        if (!userId) {
          console.error('No user_id in checkout session metadata');
          break;
        }

        // Update user with subscription ID
        if (session.subscription) {
          await db.updateUser(userId, {
            stripe_subscription_id: session.subscription as string,
            subscription_tier: 'pro',
          });
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await db.getUserByStripeCustomerId(customerId);
        if (!user) {
          console.error('No user found for customer:', customerId);
          break;
        }

        const tier = ['active', 'trialing'].includes(subscription.status) ? 'pro' : 'free';
        await db.updateUser(user.id, {
          stripe_subscription_id: subscription.id,
          subscription_tier: tier,
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await db.getUserByStripeCustomerId(customerId);
        if (!user) {
          console.error('No user found for customer:', customerId);
          break;
        }

        await db.updateUser(user.id, {
          subscription_tier: 'free',
          stripe_subscription_id: undefined,
        });
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Disable body parsing for webhook
export const config = {
  api: {
    bodyParser: false,
  },
};
