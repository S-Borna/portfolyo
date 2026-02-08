import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getStripe } from '@/lib/stripe';

// Force dynamic rendering - requires runtime env vars
export const dynamic = 'force-dynamic';

// ============================================
// STRIPE CHECKOUT SESSION
// Creates a checkout for publish or credit purchase
// ============================================

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, type, portfolioId } = body;
        // type: 'publish' | 'credits_3' | 'credits_5' | 'credits_10'

        if (!userId || !type) {
            return NextResponse.json(
                { error: 'userId och type krävs' },
                { status: 400 }
            );
        }

        const supabase = getSupabase();

        // Get or create Stripe customer
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id, email, full_name')
            .eq('id', userId)
            .single();

        if (!profile) {
            return NextResponse.json(
                { error: 'Användare hittades inte' },
                { status: 404 }
            );
        }

        let customerId = profile.stripe_customer_id;

        if (!customerId) {
            // Create Stripe customer
            const customer = await getStripe().customers.create({
                email: profile.email || undefined,
                name: profile.full_name || undefined,
                metadata: {
                    supabase_user_id: userId,
                },
            });
            customerId = customer.id;

            // Save Stripe customer ID to profile
            await supabase
                .from('profiles')
                .update({ stripe_customer_id: customerId })
                .eq('id', userId);
        }

        // Determine price based on type
        const priceId = process.env[`STRIPE_PRICE_${type.toUpperCase()}`];
        if (!priceId) {
            return NextResponse.json(
                { error: 'Ogiltig produkttyp' },
                { status: 400 }
            );
        }

        // Build checkout session
        const origin = request.headers.get('origin') || 'https://portfolyo.se';

        const sessionParams: any = {
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: type === 'publish'
                ? `${origin}/dashboard?payment=success&type=publish`
                : `${origin}/dashboard?payment=success&type=credits`,
            cancel_url: type === 'publish'
                ? `${origin}/dashboard?payment=cancelled`
                : `${origin}/upgrade?payment=cancelled`,
            metadata: {
                user_id: userId,
                type: type,
                portfolio_id: portfolioId || '',
            },
            locale: 'sv',
        };

        const session = await getStripe().checkout.sessions.create(sessionParams);

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Kunde inte skapa betalning' },
            { status: 500 }
        );
    }
}
