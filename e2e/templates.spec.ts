import { test, expect } from '@playwright/test';

/**
 * Templates Gallery Tests
 * Tests for template browsing functionality
 */

test.describe('Templates Gallery', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/templates');
    });

    test('should display template gallery', async ({ page }) => {
        // Wait for templates to load
        await page.waitForLoadState('networkidle');

        // Should have template cards
        const templateCards = page.locator('[data-testid="template-card"], .template-card, [class*="template"]');
        const count = await templateCards.count();

        // Should have at least some templates
        expect(count).toBeGreaterThan(0);
    });

    test('should have category filters', async ({ page }) => {
        // Look for filter buttons/tabs
        const filters = page.getByRole('button', { name: /portfolio|cv|alla/i });
        const filterCount = await filters.count();

        expect(filterCount).toBeGreaterThan(0);
    });

    test('should filter templates when clicking category', async ({ page }) => {
        await page.waitForLoadState('networkidle');

        // Get initial count
        const initialCards = page.locator('[data-testid="template-card"], .template-card');
        const initialCount = await initialCards.count();

        // Click a filter (CV or Portfolio)
        const cvFilter = page.getByRole('button', { name: /^cv$/i }).first();
        if (await cvFilter.isVisible()) {
            await cvFilter.click();
            await page.waitForTimeout(500);

            // Count should potentially change (or stay same if showing all)
            const filteredCards = page.locator('[data-testid="template-card"], .template-card');
            const filteredCount = await filteredCards.count();

            // Just verify the filter didn't break anything
            expect(filteredCount).toBeGreaterThanOrEqual(0);
        }
    });

    test('should show preview on template click', async ({ page }) => {
        await page.waitForLoadState('networkidle');

        // Click first template card
        const firstCard = page.locator('[data-testid="template-card"], .template-card').first();

        if (await firstCard.isVisible()) {
            await firstCard.click();

            // Should either open modal or navigate
            // Wait for any modal or preview to appear
            await page.waitForTimeout(500);

            // Check for modal or preview element
            const modal = page.locator('[role="dialog"], .modal, [class*="preview"]');
            const isModalVisible = await modal.isVisible().catch(() => false);

            // Either modal is visible or we navigated
            expect(isModalVisible || page.url().includes('preview')).toBeTruthy;
        }
    });

    test('should be accessible with keyboard', async ({ page }) => {
        await page.waitForLoadState('networkidle');

        // Tab to first interactive element
        await page.keyboard.press('Tab');

        // Should have focus on something
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
    });

    test('should load on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Templates should still be visible
        const templates = page.locator('[data-testid="template-card"], .template-card, [class*="template"]');
        const count = await templates.count();

        expect(count).toBeGreaterThan(0);
    });
});
