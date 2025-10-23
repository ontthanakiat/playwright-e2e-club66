import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegistrationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  private registerLink = () => this.page.getByRole('link', { name: 'Register' });
  private selectPlanHeading = () => this.page.locator('h2');
  private freePlanText = () => this.page.locator('[id="__nuxt"]');
  private getStartedButton = () => this.page.getByRole('button', { name: 'Get started' }).first();
  private firstNameInput = () => this.page.getByRole('textbox', { name: 'First name *' });
  private lastNameInput = () => this.page.getByRole('textbox', { name: 'Last name *' });
  private emailInput = () => this.page.getByRole('textbox', { name: 'Email *' });
  private phoneInput = () => this.page.getByRole('textbox', { name: 'Phone Number' });
  private passwordInput = () => this.page.locator('#pv_id_0_1_29');
  private confirmPasswordInput = () => this.page.locator('#pv_id_0_1_25');
  private signUpButton = () => this.page.getByRole('button', { name: 'Sign Up' });
  private freeTrialLabel = () => this.page.getByLabel('Free Trial');

  // Actions
  async goto() {
    await super.goto('/login?redirect=/');
    await this.registerLink().click();
  }

  async selectFreePlan() {
    await expect(this.selectPlanHeading()).toContainText('Select Plan');
    await expect(this.freePlanText()).toContainText('Free');
    await this.getStartedButton().click();
  }

  async fillRegistrationForm(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    await this.firstNameInput().fill(userData.firstName);
    await this.lastNameInput().fill(userData.lastName);
    await this.emailInput().fill(userData.email);
    await this.phoneInput().fill(userData.phone);
    await this.passwordInput().fill(userData.password);
    await this.confirmPasswordInput().fill(userData.password);
  }

  async submitRegistration() {
    await this.signUpButton().click();
  }

  async completeRegistration(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    await this.goto();
    await this.selectFreePlan();
    await this.fillRegistrationForm(userData);
    await this.submitRegistration();
  }

  // Assertions
  async expectFreeTrialVisible() {
    await expect(this.freeTrialLabel().getByText('Free Trial')).toBeVisible();
  }

  async expectRegistrationSuccess() {
    await this.expectFreeTrialVisible();
  }
}
