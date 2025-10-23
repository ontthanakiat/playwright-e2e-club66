import { test } from '@/support/fixtures/test-fixtures';
import { expect } from '@playwright/test';

test.describe('Registration Flow @smoke', () => {
  test('should register with free trial', async ({ registrationPage, testData }) => {
    // Arrange
    const userData = testData.registration.validUser;
    
    // Act
    await registrationPage.completeRegistration(userData);
    
    // Assert
    await registrationPage.expectRegistrationSuccess();
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
    // await expect(registrationPage.getValidationErrors()).toBeVisible();
  });
});
