# Playwright Club66 Testing Framework

A comprehensive Playwright testing framework for E2E and API testing of the Club66 application.

## 🏗️ Project Structure

```
playwright-club66/
├── pages/                    # Page Object Models
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   └── RegistrationPage.ts
├── support/                  # Helper code
│   ├── api-client/          # API wrapper classes
│   ├── fixtures/            # Custom Playwright fixtures
│   ├── utils/               # Utility functions
│   └── types/               # TypeScript type definitions
├── fixtures/                 # Test data (JSON/CSV)
│   └── test-data.json
├── tests/                    # Test specifications
│   ├── e2e/                 # End-to-end UI tests
│   ├── api/                 # API tests
│   └── visual/              # Visual regression tests
├── reports/                  # Test output
│   ├── html/                # HTML reports
│   └── allure-results/      # Allure reports
├── screenshots/              # Failure screenshots
├── videos/                   # Test execution videos
├── playwright.config.ts      # Main configuration
├── env.example              # Environment template
└── package.json
```

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Copy environment template
cp env.example .env.dev

# Edit .env.dev with your actual values
# BASE_URL=https://dev.club66.pro
# TEST_EMAIL=your-email@example.com
# TEST_PASSWORD=your-password
```

### 2. Install Dependencies

```bash
npm run setup
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Run smoke tests only
npm run test:smoke

# Run API tests
npm run test:api

# Run E2E tests
npm run test:e2e

# Run visual tests
npm run test:visual

# Run with UI
npm run test:ui
```

## 🎯 Test Types

### E2E Tests
- **Location**: `tests/e2e/`
- **Purpose**: End-to-end user journey testing
- **Examples**: Login flow, registration, checkout

### API Tests
- **Location**: `tests/api/`
- **Purpose**: API endpoint testing
- **Examples**: Authentication, user management, data validation

### Visual Tests
- **Location**: `tests/visual/`
- **Purpose**: Visual regression testing
- **Examples**: Screenshot comparisons, UI consistency

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | Application URL | `https://dev.club66.pro` |
| `API_URL` | API endpoint | `https://dev.club66.pro/api` |
| `TEST_EMAIL` | Test user email | Required |
| `TEST_PASSWORD` | Test user password | Required |
| `GMAIL_CREDENTIALS_PATH` | Gmail credentials file | `./credentials.json` |
| `GMAIL_TOKEN_PATH` | Gmail token file | `./token.json` |

### Test Tags

- `@smoke` - Critical path tests (run on every PR)
- `@regression` - Full feature tests (run nightly)
- `@api` - API-only tests
- `@e2e` - End-to-end UI tests
- `@visual` - Visual regression tests

## 📊 Reporting

### HTML Reports
```bash
npm run report
```

### Test Results
- **HTML Report**: `reports/html/`
- **JSON Results**: `reports/results.json`
- **Screenshots**: `screenshots/`
- **Videos**: `videos/`

## 🛠️ Development

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Adding New Tests

1. **E2E Test**: Create in `tests/e2e/` with Page Object Model
2. **API Test**: Create in `tests/api/` with API client
3. **Visual Test**: Create in `tests/visual/` with screenshots

### Page Object Model

```typescript
// pages/NewPage.ts
export class NewPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private element = () => this.page.getByTestId('element');
  
  async performAction() {
    await this.element().click();
  }
}
```

## 🔐 Security

- Never commit `.env` files
- Use `env.example` as template
- Store credentials in environment variables
- Use GitHub Secrets for CI/CD

## 📋 Best Practices

- Use Page Object Model for all UI interactions
- Follow AAA pattern (Arrange-Act-Assert)
- Use semantic selectors (role, label, text)
- Keep tests independent and focused
- Use proper error handling and retries
- Clean up test data after tests

## 🚀 CI/CD

The framework is configured for GitHub Actions with:
- Multi-environment support (dev/staging/prod)
- Parallel test execution
- Comprehensive reporting
- Artifact uploads for debugging

## 📞 Support

For questions or issues:
1. Check existing documentation
2. Review test examples
3. Check configuration files
4. Contact the development team
