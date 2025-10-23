import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  private usernameInput = () => this.page.getByRole('textbox', { name: 'Username' });
  private passwordInput = () => this.page.getByRole('textbox', { name: '********' });
  private loginButton = () => this.page.getByRole('button', { name: 'Login' });
  private otpHeading = () => this.page.getByRole('heading', { name: 'OTP Verification' });
  private otpInputs = () => this.page.getByRole('textbox');
  private verifyButton = () => this.page.getByRole('button', { name: 'Verify' });
  private freeTrialLabel = () => this.page.getByLabel('Free Trial');
  private userProfileLink = () => this.page.locator('a').filter({ hasText: 'Ont ThanakiatFree Trial' });
  private errorMessage = () => this.page.locator('[role="alert"], .error, .alert, [class*="error"], [class*="alert"]').first();

  // Actions
  async goto() {
    await super.goto('/login?redirect=/');
  }

  async login(email: string, password: string) {
    await this.usernameInput().click();
    await this.usernameInput().fill(email);
    await this.passwordInput().click();
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }

  async fillOTP(otp: string) {
    // Fill the 4 OTP input fields
    for (let i = 0; i < Math.min(4, otp.length); i++) {
      await this.otpInputs().nth(i).fill(otp[i]);
    }
    await this.verifyButton().click();
  }

  // Assertions
  async expectOTPVerificationVisible() {
    await expect(this.otpHeading()).toBeVisible();
  }

  async expectFreeTrialVisible() {
    await expect(this.freeTrialLabel().getByText('Free Trial')).toBeVisible();
  }

  async expectUserProfileVisible() {
    await expect(this.userProfileLink()).toBeVisible();
  }

  async expectLoginSuccess() {
    await this.expectFreeTrialVisible();
    await this.expectUserProfileVisible();
  }

  async waitForEmailDelivery() {
    // Wait for email to be sent (5 seconds)
    await this.page.waitForTimeout(5000);
  }

  async getErrorMessage(): Promise<string> {
    try {
      // Wait for error message to appear
      await this.errorMessage().waitFor({ state: 'visible', timeout: 5000 });
      return await this.errorMessage().textContent() || '';
    } catch (error) {
      // If no error message found, return empty string
      return '';
    }
  }

  async expectToHaveURL(url: string | RegExp) {
    await expect(this.page).toHaveURL(url);
  }
}
