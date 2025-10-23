import { test as base, Page } from '@playwright/test';
import { LoginPage } from '@/pages/LoginPage';
import { RegistrationPage } from '@/pages/RegistrationPage';
import { UserApiClient } from '@/support/api-client/UserApiClient';
import testData from '@/fixtures/test-data.json';

type TestFixtures = {
  loginPage: LoginPage;
  registrationPage: RegistrationPage;
  userApi: UserApiClient;
  testData: typeof testData;
  authenticatedPage: Page;
};

export const test = base.extend<TestFixtures>({
  // Page Object fixtures
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  registrationPage: async ({ page }, use) => {
    const registrationPage = new RegistrationPage(page);
    await use(registrationPage);
  },

  // API client fixture
  userApi: async ({ request }, use) => {
    const userApi = new UserApiClient(request);
    await use(userApi);
  },

  // Test data fixture
  testData: async ({}, use) => {
    await use(testData);
  },

  // Pre-authenticated page fixture
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Pre-login setup
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testData.users.valid.email, testData.users.valid.password);
    
    // Wait for OTP verification (you might need to handle this differently)
    await page.waitForTimeout(5000);
    
    await use(page);
    await context.close();
  }
});
