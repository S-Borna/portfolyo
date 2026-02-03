// ============================================
// PORTFOLYO.SE - Rate Limiting
// In-memory rate limiter for API protection
// ============================================

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

// In-memory store (works per-worker in Cloudflare)
// For production at scale, use Cloudflare KV or Durable Objects
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;

    lastCleanup = now;
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetAt < now) {
            rateLimitStore.delete(key);
        }
    }
}

export interface RateLimitConfig {
    /** Maximum requests per window */
    maxRequests: number;
    /** Window size in milliseconds */
    windowMs: number;
    /** Key prefix for namespacing */
    keyPrefix?: string;
}

export interface RateLimitResult {
    /** Whether the request is allowed */
    allowed: boolean;
    /** Remaining requests in current window */
    remaining: number;
    /** When the rate limit resets (Unix timestamp) */
    resetAt: number;
    /** Total requests allowed per window */
    limit: number;
}

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): RateLimitResult {
    cleanup();

    const { maxRequests, windowMs, keyPrefix = '' } = config;
    const key = `${keyPrefix}:${identifier}`;
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    // Create new entry if doesn't exist or window has passed
    if (!entry || entry.resetAt < now) {
        entry = {
            count: 0,
            resetAt: now + windowMs,
        };
    }

    entry.count++;
    rateLimitStore.set(key, entry);

    const allowed = entry.count <= maxRequests;
    const remaining = Math.max(0, maxRequests - entry.count);

    return {
        allowed,
        remaining,
        resetAt: entry.resetAt,
        limit: maxRequests,
    };
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
    return {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(result.resetAt / 1000).toString(),
    };
}

/**
 * Extract client identifier from request
 * Uses IP address with fallback
 */
export function getClientIdentifier(request: Request): string {
    // Try various headers for the real IP
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    const cfIp = request.headers.get('cf-connecting-ip');
    if (cfIp) {
        return cfIp;
    }

    // Fallback (shouldn't happen in production)
    return 'unknown';
}

// ============================================
// PREDEFINED RATE LIMIT CONFIGS
// ============================================

export const RATE_LIMITS = {
    /** AI generation - expensive, limit strictly */
    ai: {
        maxRequests: 10,
        windowMs: 60 * 1000, // 10 per minute
        keyPrefix: 'ai',
    },

    /** API general - moderate limits */
    api: {
        maxRequests: 60,
        windowMs: 60 * 1000, // 60 per minute
        keyPrefix: 'api',
    },

    /** Auth attempts - prevent brute force */
    auth: {
        maxRequests: 5,
        windowMs: 15 * 60 * 1000, // 5 per 15 minutes
        keyPrefix: 'auth',
    },

    /** Portfolio views - generous limits */
    views: {
        maxRequests: 100,
        windowMs: 60 * 1000, // 100 per minute
        keyPrefix: 'views',
    },
} as const;

// ============================================
// CREDITS VALIDATION
// ============================================

export interface CreditValidationResult {
    allowed: boolean;
    creditsRemaining: number;
    error?: string;
}

/**
 * Validate that user has enough credits for an operation
 * This is a helper - actual deduction happens in store/database
 */
export function validateCredits(
    userCredits: number,
    requiredCredits: number
): CreditValidationResult {
    if (userCredits < requiredCredits) {
        return {
            allowed: false,
            creditsRemaining: userCredits,
            error: `Otillräckliga credits. Du har ${userCredits}, behöver ${requiredCredits}.`,
        };
    }

    return {
        allowed: true,
        creditsRemaining: userCredits - requiredCredits,
    };
}
