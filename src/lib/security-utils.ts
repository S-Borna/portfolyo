// ============================================
// PORTFOLYO.SE - Security Utilities
// Input validation, sanitization, and protection
// ============================================

// ============================================
// INPUT SANITIZATION
// ============================================

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(str: string): string {
    const htmlEscapes: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;',
    };

    return str.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char]);
}

/**
 * Sanitize user input for database storage
 * Removes potentially dangerous characters while preserving Swedish characters
 */
export function sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';

    return input
        // Remove null bytes
        .replace(/\0/g, '')
        // Remove control characters except newlines and tabs
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
        // Trim whitespace
        .trim();
}

/**
 * Sanitize a username/slug for URLs
 */
export function sanitizeSlug(slug: string): string {
    return slug
        .toLowerCase()
        .replace(/[åä]/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 50);
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
    return email
        .toLowerCase()
        .trim()
        .slice(0, 254); // Max email length per RFC 5321
}

// ============================================
// INPUT VALIDATION
// ============================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate Swedish phone number
 */
export function isValidSwedishPhone(phone: string): boolean {
    // Accept various Swedish formats
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const phoneRegex = /^(\+46|0)[0-9]{7,10}$/;
    return phoneRegex.test(cleanPhone);
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

/**
 * Validate username/slug
 */
export function isValidUsername(username: string): { valid: boolean; error?: string } {
    if (username.length < 3) {
        return { valid: false, error: 'Användarnamn måste vara minst 3 tecken' };
    }
    if (username.length > 30) {
        return { valid: false, error: 'Användarnamn får vara max 30 tecken' };
    }
    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(username)) {
        return { valid: false, error: 'Endast små bokstäver, siffror och bindestreck (ej i början/slutet)' };
    }
    if (RESERVED_USERNAMES.includes(username)) {
        return { valid: false, error: 'Detta användarnamn är reserverat' };
    }
    return { valid: true };
}

// Reserved usernames that can't be used
const RESERVED_USERNAMES = [
    'admin', 'administrator', 'root', 'system',
    'api', 'app', 'www', 'mail', 'email',
    'login', 'logout', 'register', 'signup', 'signin',
    'dashboard', 'settings', 'profile', 'account',
    'help', 'support', 'contact', 'about',
    'blog', 'news', 'legal', 'privacy', 'terms',
    'portfolyo', 'portfolio', 'cv', 'resume',
    'null', 'undefined', 'true', 'false',
];

// ============================================
// PASSWORD VALIDATION
// ============================================

interface PasswordValidation {
    valid: boolean;
    errors: string[];
    strength: 'weak' | 'fair' | 'good' | 'strong';
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): PasswordValidation {
    const errors: string[] = [];
    let strength = 0;

    if (password.length < 8) {
        errors.push('Lösenordet måste vara minst 8 tecken');
    } else {
        strength += 1;
    }

    if (password.length >= 12) {
        strength += 1;
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Måste innehålla minst en liten bokstav');
    } else {
        strength += 1;
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Måste innehålla minst en stor bokstav');
    } else {
        strength += 1;
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Måste innehålla minst en siffra');
    } else {
        strength += 1;
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        strength += 1;
    }

    const strengthLabels: Record<number, PasswordValidation['strength']> = {
        0: 'weak',
        1: 'weak',
        2: 'weak',
        3: 'fair',
        4: 'good',
        5: 'strong',
        6: 'strong',
    };

    return {
        valid: errors.length === 0,
        errors,
        strength: strengthLabels[Math.min(strength, 6)],
    };
}

// ============================================
// CSRF PROTECTION
// ============================================

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate origin header against allowed origins
 */
export function isValidOrigin(origin: string | null, allowedOrigins: string[]): boolean {
    if (!origin) return false;
    return allowedOrigins.some(allowed => {
        if (allowed.includes('*')) {
            const pattern = allowed.replace(/\*/g, '.*');
            return new RegExp(`^${pattern}$`).test(origin);
        }
        return allowed === origin;
    });
}

// ============================================
// CONTENT SECURITY
// ============================================

/**
 * Check if content contains potentially dangerous patterns
 */
export function containsDangerousContent(content: string): boolean {
    const dangerousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi, // onclick, onerror, etc.
        /data:text\/html/gi,
        /vbscript:/gi,
    ];

    return dangerousPatterns.some(pattern => pattern.test(content));
}

/**
 * Strip HTML tags from content
 */
export function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
}

// ============================================
// RATE LIMIT HELPERS
// ============================================

/**
 * Check if an IP is in a list of blocked IPs
 */
export function isBlockedIP(ip: string, blockedIPs: string[]): boolean {
    return blockedIPs.includes(ip);
}

/**
 * Parse IP from various header formats
 */
export function parseClientIP(request: Request): string {
    // Cloudflare
    const cfIP = request.headers.get('cf-connecting-ip');
    if (cfIP) return cfIP;

    // Standard proxies
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();

    const realIP = request.headers.get('x-real-ip');
    if (realIP) return realIP;

    return 'unknown';
}

// ============================================
// EXPORTS
// ============================================

export const security = {
    escapeHtml,
    sanitizeInput,
    sanitizeSlug,
    sanitizeEmail,
    isValidEmail,
    isValidSwedishPhone,
    isValidUrl,
    isValidUsername,
    validatePassword,
    generateCSRFToken,
    isValidOrigin,
    containsDangerousContent,
    stripHtml,
    isBlockedIP,
    parseClientIP,
};
