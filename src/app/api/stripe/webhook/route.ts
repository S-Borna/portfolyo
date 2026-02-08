import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { getStripe, STRIPE_WEBHOOK_SECRET, getCreditsForPriceId } from '@/lib/stripe';

// ============================================
// STRIPE WEBHOOK HANDLER
// Processes payment events from Stripe
// ============================================

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'Missing stripe-signature header' },
                { status: 400 }
            );
        }

        let event: Stripe.Event;

        try {
            event = getStripe().webhooks.constructEvent(
                body,
                signature,
                STRIPE_WEBHOOK_SECRET
            );
        } catch (err: any) {
            console.error('Webhook signature verification failed:', err.message);
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        const supabase = getSupabase();

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.user_id;
                const type = session.metadata?.type;
                const portfolioId = session.metadata?.portfolio_id;

                if (!userId || !type) {
                    console.error('Missing metadata in checkout session');
                    break;
                }

                if (type === 'publish') {
                    // Mark user as paid
                    await supabase
                        .from('profiles')
                        .update({ has_paid: true })
                        .eq('id', userId);

                    // Auto-publish the portfolio if portfolio_id provided
                    if (portfolioId) {
                        await supabase
                            .from('portfolios')
                            .update({
                                status: 'published',
                                published_at: new Date().toISOString(),
                            })
                            .eq('id', portfolioId)
                            .eq('user_id', userId);
                    }

                    // Log the transaction
                    await supabase.from('credit_transactions').insert({
                        user_id: userId,
                        type: 'publish',
                        amount: 0,
                        description: 'Engångspublicering – portfolio + CV',
                        stripe_session_id: session.id,
                    });

                    console.log(`[Stripe] User ${userId} marked as paid, portfolio ${portfolioId} published`);

                } else if (type.startsWith('credits_')) {
                    // Get the line items to find the price
                    const lineItems = await getStripe().checkout.sessions.listLineItems(session.id);
                    const priceId = lineItems.data[0]?.price?.id;
                    const creditsToAdd = priceId
                        ? getCreditsForPriceId(priceId)
                        : parseInt(type.replace('credits_', ''), 10) || 0;

                    if (creditsToAdd > 0) {
                        // Add credits to user profile
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('credits')
                            .eq('id', userId)
                            .single();

                        const currentCredits = profile?.credits || 0;

                        await supabase
                            .from('profiles')
                            .update({ credits: currentCredits + creditsToAdd })
                            .eq('id', userId);

                        // Log the transaction
                        await supabase.from('credit_transactions').insert({
                            user_id: userId,
                            type: 'credit_purchase',
                            amount: creditsToAdd,
                            description: `Köp av ${creditsToAdd} credits`,
                            stripe_session_id: session.id,
                        });

                        console.log(`[Stripe] Added ${creditsToAdd} credits to user ${userId}`);
                    }
                }
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.error(`[Stripe] Payment failed for ${paymentIntent.id}:`, paymentIntent.last_payment_error?.message);
                break;
            }

            default:
                console.log(`[Stripe] Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Webhook handler error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}

// Disable body parsing — Stripe needs raw body for signature verification
export const dynamic = 'force-dynamic';
