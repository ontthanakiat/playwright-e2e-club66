import { test, expect } from '@playwright/test';

test.describe('Login Page Visual Tests @visual', () => {
  test('should match login page screenshot', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('should match OTP verification page screenshot', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.getByRole('textbox', { name: 'Username' }).fill('test@example.com');
    await page.getByRole('textbox', { name: '********' }).fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for OTP page
    await page.waitForSelector('h2:has-text("OTP Verification")');
    await expect(page).toHaveScreenshot('otp-verification-page.png');
  });

  test('should match mobile login page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('login-page-mobile.png');
  });
});
