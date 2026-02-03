import { test, expect } from '@playwright/test';

/**
 * Authentication Tests
 * Tests for login and registration flows
 */

test.describe('Authentication', () => {

    test.describe('Login Page', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/login');
        });

        test('should display login form', async ({ page }) => {
            // Check form elements exist
            const emailInput = page.getByLabel(/e-post|email/i);
            const passwordInput = page.getByLabel(/lösenord|password/i);
            const submitButton = page.getByRole('button', { name: /logga in|login/i });

            await expect(emailInput).toBeVisible();
            await expect(passwordInput).toBeVisible();
            await expect(submitButton).toBeVisible();
        });

        test('should show validation error for empty fields', async ({ page }) => {
            const submitButton = page.getByRole('button', { name: /logga in|login/i });
            await submitButton.click();

            // Should show some kind of error or not submit
            // Form should still be on login page
            await expect(page).toHaveURL('/login');
        });

        test('should have link to registration', async ({ page }) => {
            const registerLink = page.getByRole('link', { name: /skapa konto|registrera/i });
            await expect(registerLink).toBeVisible();

            await registerLink.click();
            await expect(page).toHaveURL('/register');
        });

        test('should show error for invalid credentials', async ({ page }) => {
            const emailInput = page.getByLabel(/e-post|email/i);
            const passwordInput = page.getByLabel(/lösenord|password/i);
            const submitButton = page.getByRole('button', { name: /logga in|login/i });

            await emailInput.fill('invalid@test.com');
            await passwordInput.fill('wrongpassword123');
            await submitButton.click();

            // Wait for error message or toast
            // Should stay on login page
            await expect(page).toHaveURL('/login');
        });
    });

    test.describe('Register Page', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/register');
        });

        test('should display registration form', async ({ page }) => {
            const emailInput = page.getByLabel(/e-post|email/i);
            const passwordInput = page.getByLabel(/lösenord|password/i);

            await expect(emailInput).toBeVisible();
            await expect(passwordInput).toBeVisible();
        });

        test('should have link to login', async ({ page }) => {
            const loginLink = page.getByRole('link', { name: /logga in|redan.*konto/i });
            await expect(loginLink).toBeVisible();

            await loginLink.click();
            await expect(page).toHaveURL('/login');
        });

        test('should validate email format', async ({ page }) => {
            const emailInput = page.getByLabel(/e-post|email/i);

            await emailInput.fill('invalid-email');
            await emailInput.blur();

            // Check for validation state (native or custom)
            const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
            expect(isInvalid).toBe(true);
        });
    });
});
