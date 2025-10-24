import { test, expect } from '@playwright/test';

test.describe('API Debug @api', () => {
  test('should debug API endpoints', async ({ request }) => {
    console.log('Testing API endpoints...');
    
    // Test 1: Try to access the API base URL
    try {
      const response = await request.get('/');
      console.log(`Base URL response status: ${response.status()}`);
      console.log(`Base URL response headers:`, response.headers());
      const text = await response.text();
      console.log(`Base URL response preview: ${text.substring(0, 200)}...`);
    } catch (error) {
      console.log('Base URL error:', error);
    }
    
    // Test 2: Try to access /api/members without auth
    try {
      const response = await request.get('/members');
      console.log(`Members endpoint status: ${response.status()}`);
      console.log(`Members endpoint headers:`, response.headers());
      const text = await response.text();
      console.log(`Members endpoint response preview: ${text.substring(0, 200)}...`);
    } catch (error) {
      console.log('Members endpoint error:', error);
    }
    
    // Test 3: Try to access /api/auth/login
    try {
      const response = await request.post('/auth/login', {
        data: { email: 'test@test.com', password: 'test' }
      });
      console.log(`Login endpoint status: ${response.status()}`);
      console.log(`Login endpoint headers:`, response.headers());
      const text = await response.text();
      console.log(`Login endpoint response preview: ${text.substring(0, 200)}...`);
    } catch (error) {
      console.log('Login endpoint error:', error);
    }
  });
});
