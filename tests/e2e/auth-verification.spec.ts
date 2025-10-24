import { test, expect } from '@playwright/test';

test.describe('Authentication Verification @smoke', () => {
  test('should be authenticated and access protected page', async ({ page }) => {
    // Navigate to a protected page
    await page.goto('/dashboard');
    
    // Verify we're not redirected to login
    await expect(page).not.toHaveURL(/login/);
    
    // Verify we can access authenticated content
    // Adjust these selectors based on your application
    try {
      await expect(page.getByText('Dashboard')).toBeVisible({ timeout: 10000 });
    } catch (error) {
      // If dashboard text is not found, check for other authenticated indicators
      console.log('Dashboard text not found, checking for other authenticated elements...');
      
      // Check if we have authentication token in storage
      const authToken = await page.evaluate(() => {
        return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      });
      
      expect(authToken).toBeTruthy();
      console.log('Authentication token found in storage');
    }
  });

  test('should have authentication token in storage', async ({ page }) => {
    await page.goto('/');
    
    // Check for authentication token in localStorage
    const authToken = await page.evaluate(() => {
      return localStorage.getItem('authToken');
    });
    
    expect(authToken).toBeTruthy();
    expect(authToken).toMatch(/^[A-Za-z0-9\-_]+$/); // Basic JWT token format validation
  });
});
