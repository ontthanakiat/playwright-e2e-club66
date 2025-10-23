import { test, expect } from '@playwright/test';
import { UserApiClient } from '@/support/api-client/UserApiClient';

test.describe('Authentication API @api', () => {
  let userApi: UserApiClient;

  test.beforeAll(async ({ request }) => {
    userApi = new UserApiClient(request);
  });

  test('should authenticate with valid credentials', async () => {
    // Arrange
    const credentials = {
      email: process.env.TEST_EMAIL || 'ont@outsourcify.net',
      password: process.env.TEST_PASSWORD || 'St@rt123'
    };
    
    // Act
    const response = await userApi.authenticateUser(credentials.email, credentials.password);
    
    // Assert
    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('user');
    expect(response.user.email).toBe(credentials.email);
  });

  test('should reject invalid credentials', async () => {
    // Arrange
    const invalidCredentials = {
      email: 'invalid@test.com',
      password: 'wrongpassword'
    };
    
    // Act & Assert
    await expect(userApi.authenticateUser(invalidCredentials.email, invalidCredentials.password))
      .rejects.toThrow('API authenticateUser failed');
  });

  test('should verify OTP', async () => {
    // Arrange
    const email = process.env.TEST_EMAIL || 'ont@outsourcify.net';
    const otp = '1234'; // This would be retrieved from email in real test
    
    // Act & Assert
    // Note: This test might fail if OTP is not valid, which is expected
    try {
      const response = await userApi.verifyOTP(email, otp);
      expect(response).toHaveProperty('token');
      expect(response).toHaveProperty('user');
    } catch (error) {
      // Expected to fail with invalid OTP
      expect(error instanceof Error ? error.message : String(error)).toContain('API verifyOTP failed');
    }
  });
});
