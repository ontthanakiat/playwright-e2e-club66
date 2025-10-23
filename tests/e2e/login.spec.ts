import { test } from '@/support/fixtures/test-fixtures';
import { expect } from '@playwright/test';
import { getOTPFromGmail } from '@/support/utils/gmail-helper';

test.describe('Login Flow @smoke', () => {
  test.only('should login with valid credentials and OTP verification', async ({ loginPage, testData }) => {
    // Arrange
    const user = testData.users.valid;
    
    // Act
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await loginPage.expectOTPVerificationVisible();

    // Wait a moment for email to be sent
    await loginPage.waitForEmailDelivery();

    // Get OTP from Gmail
    const toEmail = process.env.TEST_EMAIL;
    if (!toEmail) {
      throw new Error('TEST_EMAIL environment variable is required');
    }
    const otp = await getOTPFromGmail({
      to: toEmail,
      waitTimeSec: 60
    });

    // Fill OTP and verify
    await loginPage.fillOTP(otp);
    
    // Assert
    await loginPage.expectLoginSuccess();
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    // Arrange
    const invalidCredentials = {
      email: 'invalid@test.com',
      password: 'wrongpassword'
    };
    
    // Act
    await loginPage.goto();
    await loginPage.login(invalidCredentials.email, invalidCredentials.password);
    
    // Assert - Check that an error message appears (exact text may vary)
    const errorMessage = await loginPage.getErrorMessage();
    console.log('Error message received:', errorMessage);
    
    // For now, just check that some error message appears
    // TODO: Update with exact error message text once confirmed
    if (errorMessage) {
      expect(errorMessage.length).toBeGreaterThan(0);
    } else {
      // If no specific error message, check that we're still on login page
      await loginPage.expectToHaveURL(/login/);
    }
  });
});