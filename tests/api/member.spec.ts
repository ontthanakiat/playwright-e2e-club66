import { test, expect } from '@playwright/test';
import { MemberApiClient } from '@/support/api-client/MemberApiClient';

test.describe('Member API @api', () => {
  test('should delete member by email', async ({ request }) => {
    // Arrange
    const memberApi = new MemberApiClient(request);
    const testEmail = 'ont@outsourcify.net'; // The email from the Postman response
    
    // Act & Assert
    try {
      // First login to get authentication token
      await memberApi.login();
      
      // Then delete the user
      await memberApi.deleteMemberByEmail(testEmail);
      
      console.log('Successfully deleted member');
    } catch (error) {
      console.log('Error:', error instanceof Error ? error.message : String(error));
      // Don't fail the test if member doesn't exist
      if (error instanceof Error && error.message.includes('not found')) {
        console.log('Member not found - nothing to delete');
      } else {
        throw error;
      }
    }
  });
});
