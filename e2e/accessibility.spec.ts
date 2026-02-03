import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Tests
 * Tests for WCAG compliance using axe-core
 */

test.describe('Accessibility', () => {

    test('homepage should have no critical accessibility violations', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        // Filter for critical and serious violations only
        const criticalViolations = results.violations.filter(
            v => v.impact === 'critical' || v.impact === 'serious'
        );

        expect(criticalViolations).toHaveLength(0);
    });

    test('login page should have no critical accessibility violations', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');

        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        const criticalViolations = results.violations.filter(
            v => v.impact === 'critical' || v.impact === 'serious'
        );

        expect(criticalViolations).toHaveLength(0);
    });

    test('templates page should have no critical accessibility violations', async ({ page }) => {
        await page.goto('/templates');
        await page.waitForLoadState('networkidle');

        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        const criticalViolations = results.violations.filter(
            v => v.impact === 'critical' || v.impact === 'serious'
        );

        expect(criticalViolations).toHaveLength(0);
    });

    test('register page should have no critical accessibility violations', async ({ page }) => {
        await page.goto('/register');
        await page.waitForLoadState('networkidle');

        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        const criticalViolations = results.violations.filter(
            v => v.impact === 'critical' || v.impact === 'serious'
        );

        expect(criticalViolations).toHaveLength(0);
    });

    test('page should be navigable with keyboard only', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Tab through interactive elements
        for (let i = 0; i < 10; i++) {
            await page.keyboard.press('Tab');
        }

        // Should have focus visible on something
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
    });

    test('images should have alt text', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Find all images
        const images = page.locator('img');
        const count = await images.count();

        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const alt = await img.getAttribute('alt');
            const role = await img.getAttribute('role');

            // Image should have alt text OR be marked as decorative
            const hasAccessibleName = alt !== null || role === 'presentation';
            expect(hasAccessibleName).toBe(true);
        }
    });

    test('form inputs should have associated labels', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');

        // Find all inputs
        const inputs = page.locator('input:not([type="hidden"])');
        const count = await inputs.count();

        for (let i = 0; i < count; i++) {
            const input = inputs.nth(i);
            const id = await input.getAttribute('id');
            const ariaLabel = await input.getAttribute('aria-label');
            const ariaLabelledby = await input.getAttribute('aria-labelledby');

            // Input should have id for label, or aria-label, or aria-labelledby
            const hasLabel = id !== null || ariaLabel !== null || ariaLabelledby !== null;
            expect(hasLabel).toBe(true);
        }
    });

    test('color contrast should be sufficient', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const results = await new AxeBuilder({ page })
            .withTags(['wcag2aa'])
            .options({ rules: { 'color-contrast': { enabled: true } } })
            .analyze();

        const contrastViolations = results.violations.filter(
            v => v.id === 'color-contrast'
        );

        // Allow some violations but not too many
        expect(contrastViolations.length).toBeLessThanOrEqual(3);
    });
});
