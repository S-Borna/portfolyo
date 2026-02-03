// ============================================
// PORTFOLYO.SE - SEO Utilities
// Centraliserad SEO-hantering
// ============================================

import type { Metadata } from 'next';

// ============================================
// BASE CONFIG
// ============================================

const BASE_URL = 'https://portfolyo.se';
const SITE_NAME = 'PORTFOLYO.SE';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

// ============================================
// METADATA GENERATORS
// ============================================

interface PageMetadataOptions {
    title: string;
    description: string;
    path?: string;
    ogImage?: string;
    noIndex?: boolean;
    keywords?: string[];
}

/**
 * Generera standard metadata för en sida
 */
export function generatePageMetadata({
    title,
    description,
    path = '',
    ogImage = DEFAULT_OG_IMAGE,
    noIndex = false,
    keywords = [],
}: PageMetadataOptions): Metadata {
    const url = `${BASE_URL}${path}`;
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

    return {
        title: fullTitle,
        description,
        keywords: [
            'portfolio',
            'CV',
            'karriär',
            'professionell',
            'hostad',
            'Sverige',
            ...keywords,
        ],
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: SITE_NAME,
            locale: 'sv_SE',
            type: 'website',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [ogImage],
        },
        robots: noIndex
            ? { index: false, follow: false }
            : { index: true, follow: true },
        alternates: {
            canonical: url,
        },
    };
}

interface PortfolioMetadataOptions {
    username: string;
    fullName: string;
    title: string;
    tagline?: string;
    bio?: string;
    avatarUrl?: string;
    ogImage?: string;
}

/**
 * Generera metadata för en publik portfolio-sida
 */
export function generatePortfolioMetadata({
    username,
    fullName,
    title,
    tagline,
    bio,
    avatarUrl,
    ogImage,
}: PortfolioMetadataOptions): Metadata {
    const url = `${BASE_URL}/p/${username}`;
    const pageTitle = `${fullName} — ${title}`;
    const description = tagline || bio?.slice(0, 160) || `${fullName}s professionella portfolio`;

    return {
        title: pageTitle,
        description,
        openGraph: {
            title: pageTitle,
            description,
            url,
            siteName: SITE_NAME,
            locale: 'sv_SE',
            type: 'profile',
            images: ogImage
                ? [{ url: ogImage, width: 1200, height: 630, alt: fullName }]
                : avatarUrl
                    ? [{ url: avatarUrl, width: 400, height: 400, alt: fullName }]
                    : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: pageTitle,
            description,
            images: ogImage ? [ogImage] : avatarUrl ? [avatarUrl] : [],
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: url,
        },
    };
}

// ============================================
// STRUCTURED DATA (JSON-LD)
// ============================================

interface PersonStructuredDataOptions {
    name: string;
    jobTitle: string;
    url: string;
    email?: string;
    image?: string;
    sameAs?: string[]; // LinkedIn, GitHub, etc.
}

/**
 * Generera Person structured data för portfolio
 */
export function generatePersonStructuredData(
    options: PersonStructuredDataOptions
): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: options.name,
        jobTitle: options.jobTitle,
        url: options.url,
        ...(options.email && { email: `mailto:${options.email}` }),
        ...(options.image && { image: options.image }),
        ...(options.sameAs?.length && { sameAs: options.sameAs }),
    };
}

interface WebsiteStructuredDataOptions {
    name?: string;
    description?: string;
    url?: string;
}

/**
 * Generera Website structured data för huvudsidan
 */
export function generateWebsiteStructuredData(
    options: WebsiteStructuredDataOptions = {}
): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: options.name || SITE_NAME,
        description:
            options.description ||
            'En premiumplattform för professionella portfolios och CVs',
        url: options.url || BASE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${BASE_URL}/p/{username}`,
            },
            'query-input': 'required name=username',
        },
    };
}

// ============================================
// UTILITIES
// ============================================

/**
 * Skapa en säker URL-slug från ett namn
 */
export function createSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[åä]/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

/**
 * Trunkera text för description
 */
export function truncateForDescription(text: string, maxLength = 160): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3).trim() + '...';
}
