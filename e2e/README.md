# E2E Tests

This directory contains End-to-End tests for the Cognitio platform using Playwright.

## Quick Start

```bash
# Run all E2E tests
npm run test:e2e

# Run in interactive UI mode
npm run test:e2e:ui

# Run with visible browser
npm run test:e2e:headed
```

## Directory Structure

- **auth/** - Authentication and authorization tests
- **student/** - Student user journey tests
- **instructor/** - Instructor functionality tests
- **admin/** - Admin panel tests
- **common/** - Shared utilities, fixtures, and helpers

## Documentation

See [E2E_TESTING.md](../E2E_TESTING.md) for complete documentation including:
- Setup instructions
- Writing tests
- Best practices
- Troubleshooting
- CI/CD integration

## Test Coverage

- ✅ Authentication flows
- ✅ Course browsing and discovery
- ✅ Navigation and routing
- ✅ Responsive design
- ⚠️ Protected features (requires test data)
- ⚠️ Payment processing (requires Stripe setup)
- ⚠️ Video playback (requires Mux integration)

## Notes

Some tests are documented as expected behavior rather than full implementations because:
1. They require authenticated test users in the database
2. They require external service integration (Stripe, Mux)
3. They document the expected functionality for future implementation

These tests serve as both:
- **Specification** - Documenting expected behavior
- **Implementation** - Running actual browser tests where possible
