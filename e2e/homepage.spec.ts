import { test, expect } from '@playwright/test';

/**
 * Homepage Tests
 * Tests for the landing page functionality
 */

test.describe('Homepage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display the main heading', async ({ page }) => {
        // Check for the main headline
        const heading = page.locator('h1');
        await expect(heading).toBeVisible();
    });

    test('should have working navigation to login', async ({ page }) => {
        // Find and click login link
        const loginLink = page.getByRole('link', { name: /logga in/i });
        await expect(loginLink).toBeVisible();

        await loginLink.click();
        await expect(page).toHaveURL('/login');
    });

    test('should have working navigation to register', async ({ page }) => {
        // Find CTA button
        const ctaButton = page.getByRole('link', { name: /skapa|kom igång|registrera/i }).first();
        await expect(ctaButton).toBeVisible();

        await ctaButton.click();
        await expect(page).toHaveURL(/\/(register|onboarding)/);
    });

    test('should have templates link', async ({ page }) => {
        const templatesLink = page.getByRole('link', { name: /templates|mallar/i });
        await expect(templatesLink).toBeVisible();

        await templatesLink.click();
        await expect(page).toHaveURL('/templates');
    });

    test('should be responsive on mobile', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Content should still be visible
        const heading = page.locator('h1');
        await expect(heading).toBeVisible();

        // CTA should be visible
        const cta = page.getByRole('link', { name: /skapa|portfolio|kom igång/i }).first();
        await expect(cta).toBeVisible();
    });

    test('should have proper meta tags for SEO', async ({ page }) => {
        // Check title
        await expect(page).toHaveTitle(/PORTFOLYO/i);

        // Check meta description
        const metaDescription = page.locator('meta[name="description"]');
        await expect(metaDescription).toHaveAttribute('content', /.+/);

        // Check OG tags
        const ogTitle = page.locator('meta[property="og:title"]');
        await expect(ogTitle).toHaveAttribute('content', /.+/);
    });
});
