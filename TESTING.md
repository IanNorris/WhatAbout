# Testing Framework for WhatAbout

Comprehensive testing suite for the WhatAbout interactive story application.

## Overview

This testing framework provides:
- **Unit Tests** - Test individual functions, utilities, and story loading
- **Integration Tests** - Test story navigation and path discovery on real stories  
- **E2E Tests** - Test full user flows in a real browser with Playwright
- **Path Discovery** - Automatically explore all possible paths through Ink stories

## Quick Start

```bash
# Run all unit tests
npm run test

# Run tests in watch mode (during development)
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug
```

## Test Structure

```
WhatAbout/
├── src/
│   ├── __tests__/          # Unit tests
│   │   ├── routing.test.js
│   │   ├── stories.test.js
│   │   ├── pathDiscovery.test.js
│   │   └── integration.stories.test.js
│   └── test/               # Test utilities
│       ├── setup.js        # Global test setup
│       ├── testUtils.js    # Helper functions
│       ├── pathDiscovery.js # Path discovery algorithm
│       └── fixtures/       # Test story fixtures
│           ├── simple.ink
│           ├── choices.ink
│           ├── loop.ink
│           └── knots.ink
└── e2e/                    # End-to-end tests
    └── app.spec.js
```

## Unit Tests

### Running Unit Tests

```bash
npm run test:run      # Run once
npm test              # Watch mode
npm run test:ui       # Interactive UI
```

### Test Coverage

```bash
npm run test:coverage
```

Coverage reports are generated in:
- `coverage/index.html` - HTML report
- `coverage/coverage-final.json` - JSON report

Current coverage targets:
- **>80%** overall code coverage
- **100%** on critical paths (story loading, navigation)

### What's Tested

#### Core Functionality (`__tests__/stories.test.js`)
- ✅ Story list parsing from `stories.txt`
- ✅ Story filtering (production vs development)
- ✅ Ink file compilation
- ✅ INCLUDE statement resolution
- ✅ Error handling

#### Routing (`__tests__/routing.test.js`)
- ✅ URL hash parsing
- ✅ Navigation functions
- ✅ Story URL generation

#### Path Discovery (`__tests__/pathDiscovery.test.js`)
- ✅ Automatic path exploration through stories
- ✅ Loop detection
- ✅ Depth limiting
- ✅ Knot reachability validation
- ⚠️ Advanced knot tracking (6 tests need improvement)

#### Integration Tests (`__tests__/integration.stories.test.js`)
- ✅ Real story loading and compilation
- ✅ Path discovery on actual stories
- ✅ Story structure validation

## Path Discovery Algorithm

The path discovery utility automatically explores all possible paths through an Ink story.

### Usage

```javascript
import { discoverAllPaths } from './test/pathDiscovery';

const compiledStory = loadInkStory('/stories/my-story/main.json');

const result = await discoverAllPaths(compiledStory, {
  maxDepth: 50,          // Maximum choice depth
  maxPaths: 1000,        // Maximum paths to explore
  trackContent: false,   // Whether to capture text content
  stateHashLimit: 3,     // Loop detection threshold
});

console.log(`Found ${result.paths.length} paths`);
console.log(`Completed: ${result.stats.completedPaths}`);
console.log(`Loops detected: ${result.stats.loopsDetected}`);
```

### Path Discovery Features

- **Exhaustive Exploration** - Explores every choice combination
- **Loop Detection** - Detects and handles infinite loops
- **Depth Limiting** - Prevents runaway execution
- **Knot Tracking** - Tracks which story knots are visited
- **Cross-Story Navigation** - Handles `navigateTo()` calls

### Path Object Structure

```javascript
{
  choices: ['First choice', 'Second choice'],  // Choices made
  choiceIndices: [0, 1],                      // Choice indices
  completed: true,                             // Reached end?
  endReason: 'done',                          // 'done', 'navigateTo', 'loop', 'maxDepth'
  content: ['...'],                           // Text content (if tracked)
  knots: ['intro', 'middle', 'end'],         // Knots visited
  navigateToStory: 'other-story-id'          // If navigates to another story
}
```

## End-to-End Tests

E2E tests run in a real browser using Playwright.

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI (watch tests execute)
npm run test:e2e:ui

# Debug specific test
npm run test:e2e:debug
```

### What's Tested

- ✅ Hub page loading
- ✅ Story list display
- ✅ Story navigation
- ✅ Story content and choices display
- ✅ Back/home navigation
- ✅ Direct URL navigation to stories
- ✅ Error handling (invalid stories)
- ✅ Browser back/forward buttons
- ✅ Responsive design (mobile viewport)
- ✅ Accessibility (heading structure)

### E2E Test Best Practices

- Tests are resilient to UI changes (multiple selector strategies)
- Timeouts are generous to handle slow loads
- Tests gracefully skip when content isn't available
- Both happy paths and error cases are covered

## Test Fixtures

Test fixtures are simple Ink stories used for unit testing:

- `simple.ink` - Linear story with no choices
- `choices.ink` - Story with 2 choices
- `loop.ink` - Story with a loop and exit
- `knots.ink` - Story with multiple knots, including unreachable ones

### Compiling Fixtures

Fixtures are automatically compiled to JSON. To recompile:

```bash
node tools/compile-fixtures.js
```

## Adding New Tests

### Unit Test Example

```javascript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myModule';

describe('myModule', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

### E2E Test Example

```javascript
import { test, expect } from '@playwright/test';

test('should perform user action', async ({ page }) => {
  await page.goto('/');
  
  await page.click('text=Click me');
  
  await expect(page).toHaveURL(/success/);
});
```

## Continuous Integration

Tests can be run in CI environments. See `.github/workflows/test.yml` for configuration.

### CI Commands

```bash
# Install dependencies
npm ci

# Run all tests in CI mode
npm run test:run
npm run test:e2e
```

## Troubleshooting

### Tests Failing Due to Module Cache

```bash
# Clear Vitest cache
npx vitest --run --clearCache
```

### E2E Tests Timing Out

- Increase timeouts in `playwright.config.js`
- Check that dev server is running (`npm run dev`)
- Ensure port 5173 is available

### Path Discovery Hanging

- Reduce `maxDepth` and `maxPaths` options
- Check for stories with infinite loops
- Increase `stateHashLimit` to detect loops faster

## Performance

- **Unit tests**: ~3 seconds for full suite
- **E2E tests**: ~30-60 seconds (depends on stories tested)
- **Path discovery**: Varies by story complexity (1-60 seconds per story)

## Future Improvements

- [ ] Complete knot tracking implementation in path discovery
- [ ] Add React component tests with Testing Library  
- [ ] Add tests for `useInkStory` hook
- [ ] Visual regression testing with Percy/Chromatic
- [ ] Performance benchmarks for story loading
- [ ] Mutation testing for test quality assessment

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Ink Language](https://github.com/inkle/ink)

## License

Same as parent project.
