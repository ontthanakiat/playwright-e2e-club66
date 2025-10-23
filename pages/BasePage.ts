import { Page, expect } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  // Common navigation
  async goto(url: string) {
    await this.page.goto(url);
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  // Common assertions
  async expectTitle(title: string) {
    await expect(this.page).toHaveTitle(title);
  }

  async expectUrl(url: string | RegExp) {
    await expect(this.page).toHaveURL(url);
  }

  // Common interactions
  async clickBack() {
    await this.page.goBack();
  }

  async refresh() {
    await this.page.reload();
  }

  // Safe operations with error handling
  protected async safeClick(selector: string, options?: any) {
    try {
      await this.page.click(selector, options);
    } catch (error) {
      throw new Error(`Failed to click "${selector}": ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  protected async safeFill(selector: string, value: string) {
    try {
      await this.page.fill(selector, value);
    } catch (error) {
      throw new Error(`Failed to fill "${selector}" with "${value}": ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  protected async safeWaitForSelector(selector: string, options?: any) {
    try {
      return await this.page.waitForSelector(selector, options);
    } catch (error) {
      throw new Error(`Element "${selector}" not found: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  protected async safeGetText(selector: string): Promise<string> {
    try {
      const element = this.page.locator(selector);
      return await element.textContent() || '';
    } catch (error) {
      throw new Error(`Failed to get text from "${selector}": ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
