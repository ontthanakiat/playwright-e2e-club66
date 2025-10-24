# Authentication Setup

This project uses Playwright's authentication setup pattern to authenticate once and reuse the authenticated state across all tests.

## How It Works

1. **Setup Project**: The `tests/auth.setup.ts` file runs before all other tests
2. **API Authentication**: Uses the `/auth/login` endpoint to authenticate via API
3. **Browser State**: Saves the authenticated browser state to `playwright/.auth/user.json`
4. **Test Reuse**: All tests automatically use the saved authentication state

## Configuration

### Environment Variables

Create a `.env.dev` file (or appropriate environment file) with:

```bash
# Test Credentials
TEST_EMAIL=your-email@example.com
TEST_PASSWORD=your-password

# Application URLs
BASE_URL=https://dev.club66.pro
API_URL=https://dev.club66.pro/api
```

### Playwright Configuration

The `playwright.config.ts` includes:

- **Setup Project**: Runs authentication before other tests
- **Dependencies**: All test projects depend on the setup project
- **Storage State**: All projects use the saved authentication state

## Usage

### Running Tests

```bash
# Run all tests (includes authentication setup)
npm test

# Run specific test project
npm run test:chromium

# Run without authentication (for login tests)
npm run test:api
```

### Test Structure

Tests automatically start authenticated:

```typescript
import { test, expect } from '@playwright/test';

test('should access protected page', async ({ page }) => {
  // Page is already authenticated
  await page.goto('/dashboard');
  await expect(page.getByText('Dashboard')).toBeVisible();
});
```

### Authentication Verification

The `tests/e2e/auth-verification.spec.ts` file contains tests to verify authentication is working correctly.

## Troubleshooting

### Authentication Fails

1. **Check Environment Variables**: Ensure `TEST_EMAIL` and `TEST_PASSWORD` are set correctly
2. **Check API Endpoint**: Verify `/auth/login` endpoint is accessible
3. **Check Token Format**: Ensure the API returns a valid token

### Token Expiration

If authentication tokens expire:

1. Delete the stored state: `rm -rf playwright/.auth/`
2. Re-run tests to regenerate authentication

### Debug Authentication

To debug authentication issues:

```bash
# Run only the setup project
npx playwright test --project=setup

# Run with debug output
DEBUG=pw:api npx playwright test --project=setup
```

## Security Notes

- Authentication state files are git-ignored
- Never commit `.env` files with real credentials
- Use environment-specific credentials for different test environments
- Rotate test credentials regularly

## Best Practices

1. **Use Environment Variables**: Never hardcode credentials in tests
2. **Separate Test Accounts**: Use dedicated test accounts for automation
3. **Clean State**: Delete authentication state when switching environments
4. **Monitor Expiration**: Set up alerts for token expiration
5. **Parallel Safety**: Ensure test accounts can be used in parallel

## Related Files

- `tests/auth.setup.ts` - Authentication setup
- `playwright.config.ts` - Project configuration
- `support/api-client/MemberApiClient.ts` - API client with authentication
- `tests/e2e/auth-verification.spec.ts` - Authentication verification tests
