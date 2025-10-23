import { test } from '@/support/fixtures/test-fixtures';
import { expect } from '@playwright/test';

test.describe('Registration Flow @smoke', () => {
  test('should register with free trial', async ({ registrationPage, testData }) => {
    // Arrange
    const userData = testData.registration.validUser;
    
    // Act
    //await registrationPage.completeRegistration(userData); // Complete registration using the page object - composed method


    // Use granular page-object methods for clarity and easier intermediate assertions
    await registrationPage.goto();
    await registrationPage.selectFreePlan();
    await registrationPage.fillRegistrationForm(userData);
    await registrationPage.submitRegistration();
    
    // Assert
    await registrationPage.expectRegistrationSuccess(); // Composed method
  });

  test('should show validation errors for empty fields', async ({ registrationPage }) => {
    // Arrange
    const emptyUserData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: ''
    };
    
    // Act
    await registrationPage.goto();
    await registrationPage.selectFreePlan();
    await registrationPage.fillRegistrationForm(emptyUserData);
    await registrationPage.submitRegistration();
    
    // Assert - Add validation error assertions when available
    await expect(registrationPage.getValidationErrors()).toBeVisible();
  });
});
