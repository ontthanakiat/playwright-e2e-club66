import { test } from '@/support/fixtures/test-fixtures';
import { expect } from '@playwright/test';

test.describe('Registration Flow @smoke', () => {

  test.only('delete user if it exists - debug', async ({ registrationPage, testData, memberApi }) => {
    const userData = testData.registration.validUser;
    
    // First login to get authentication token
    await memberApi.login();
    
    // Then delete the user
    await memberApi.deleteMemberByEmail(userData.email);
  });

  test('should register with free trial', async ({ registrationPage, testData, memberApi }) => {
    // Arrange
    const userData = testData.registration.validUser;
    
    try {
      // Act
      await registrationPage.goto();
      await registrationPage.selectFreePlan();
      await registrationPage.fillRegistrationForm(userData);
      await registrationPage.submitRegistration();
      
      // Assert
      await registrationPage.expectRegistrationSuccess();
    } finally {
      // Cleanup: Delete the registered user
      await memberApi.login();
      await memberApi.deleteMemberByEmail(userData.email);
    }
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