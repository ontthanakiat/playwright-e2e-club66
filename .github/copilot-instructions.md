# Club66 Playwright Testing Framework - AI Assistant Instructions

## 🏗️ Project Architecture

This is a Playwright-based testing framework following Page Object Model pattern:

- `tests/` - Test specifications organized by type:
  - `e2e/` - End-to-end UI tests (e.g., `login.spec.ts`)
  - `api/` - API endpoint tests (e.g., `auth.spec.ts`)
  - `visual/` - Visual regression tests

- `pages/` - Page Object Models:
  - `BasePage.ts` - Common page functionality
  - Each page has its own class (e.g., `LoginPage.ts`, `RegistrationPage.ts`)
  - Page methods should be granular for flexibility in test composition

- `support/` - Helper code and utilities:
  - `api-client/` - API wrapper classes for backend interactions
  - `fixtures/` - Custom Playwright test fixtures
  - `utils/` - Common utility functions
  - `types/` - TypeScript type definitions

## 📚 Detailed Guidelines

For comprehensive guidelines, refer to `.cursor/rules/`:

### Core Guidelines
- Project Structure: `.cursor/rules/core/02-project-structure.mdc`
- Page Objects: `.cursor/rules/core/05-page-objects.mdc`
- Test Structure: `.cursor/rules/core/06-test-structure.mdc`
- Configuration: `.cursor/rules/core/03-configuration.mdc`
- Selectors: `.cursor/rules/core/04-selectors.mdc`

### Testing Guidelines
- API Testing: `.cursor/rules/testing/01-api-testing.mdc`
- Assertions: `.cursor/rules/testing/02-assertions.mdc`
- Visual Testing: `.cursor/rules/testing/03-visual.mdc`

### Quality & Best Practices
- Best Practices: `.cursor/rules/quality/01-best-practices.mdc`
- Anti-patterns: `.cursor/rules/quality/02-anti-patterns.mdc`

### Data & Fixtures
- Test Data: `.cursor/rules/data/01-fixtures.mdc`
- Data-Driven Testing: `.cursor/rules/data/02-ddt.mdc`
- Custom Fixtures: `.cursor/rules/data/03-custom-fixtures.mdc`

## 🔑 Key Patterns & Conventions

### Test Structure
```typescript
test.describe('Feature @tag', () => {
  test('should do something specific', async ({ page, customFixture }) => {
    // Arrange - Setup test data
    const testData = {...};
    
    // Act - Perform actions
    await page.someAction();
    
    // Assert - Verify results
    await expect(page).someAssertion();
  });
});
```

### Page Objects
- Use granular methods over composed ones for flexibility
- Example from `RegistrationPage.ts`:
```typescript
// Preferred - Granular methods
await registrationPage.selectFreePlan();
await registrationPage.fillRegistrationForm(userData);
await registrationPage.submitRegistration();

// Over composed methods
await registrationPage.completeRegistration(userData);
```

## 🚀 Common Workflows

### Running Tests
```bash
npm test              # All tests
npm run test:smoke    # Smoke tests only
npm run test:e2e      # E2E tests
npm run test:api      # API tests
npm run test:visual   # Visual tests
npm run test:ui       # With Playwright UI
```

### Environment Setup
1. Copy `env.example` to `.env.dev`
2. Configure environment variables:
   - `BASE_URL` - Application URL
   - `API_URL` - API endpoint
   - `TEST_EMAIL/TEST_PASSWORD` - Test credentials

## 💡 Tips for AI Agents
- Always use page object methods over direct element interactions
- Prefer granular page methods for better test composition
- Tag tests appropriately (@smoke, @visual, etc.)
- Follow the AAA pattern: Arrange, Act, Assert
- Leverage custom fixtures from `support/fixtures/` for common setup
- Use `support/api-client/` for API interactions in tests