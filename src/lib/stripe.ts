import Stripe from 'stripe';

// Server-side Stripe client (lazy initialization)
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
    if (!_stripe) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is not set');
        }
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            typescript: true,
        });
    }
    return _stripe;
}

// Product/Price IDs (configured in Stripe Dashboard)
// These map to the PRICING in types.ts
export const STRIPE_PRICES = {
    // One-time publish fee: 349 SEK
    publish: process.env.STRIPE_PRICE_PUBLISH!,

    // Credit bundles
    credits_3: process.env.STRIPE_PRICE_CREDITS_3!, // 3 credits for 69 SEK
    credits_5: process.env.STRIPE_PRICE_CREDITS_5!, // 5 credits for 99 SEK
    credits_10: process.env.STRIPE_PRICE_CREDITS_10!, // 10 credits for 179 SEK
} as const;

// Map price IDs back to credit amounts
export function getCreditsForPriceId(priceId: string): number {
    if (priceId === STRIPE_PRICES.credits_3) return 3;
    if (priceId === STRIPE_PRICES.credits_5) return 5;
    if (priceId === STRIPE_PRICES.credits_10) return 10;
    return 0;
}

// Webhook secret for verifying Stripe events
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
