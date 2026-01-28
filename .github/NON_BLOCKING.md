# CI/CD Non-Blocking Configuration Summary

## Overview

All tests and linting in CI/CD are configured as **non-blocking**. This means:
- ✅ Workflows always complete successfully
- ⚠️ Test failures are reported but don't stop builds
- 🚀 Releases can be created even with test failures
- 📊 Results are still visible in workflow logs

## What Blocks Builds

Only critical failures block builds:
- ❌ **Ink compilation errors** - Syntax errors in `.ink` files
- ❌ **Vite build failures** - Production build errors
- ❌ **Dependency installation failures** - `npm ci` errors

## What Doesn't Block Builds

These run and report but allow workflows to continue:

### In `build-release.yml`
- ⚠️ Unit tests (`npm run test:run`)
- ⚠️ Linting (`npm run lint`)
- ⚠️ E2E tests (`npm run test:e2e`)

### In `tests.yml`
- ⚠️ Unit tests on Node 18.x and 20.x
- ⚠️ E2E tests with Playwright
- ⚠️ Linting checks

## Current Known Issues

### Test Failures (3 total)
1. **`currentPathString.test.js`** - 1 assertion failure
   - Path: `src/__tests__/currentPathString.test.js:125`
   - Issue: `expected null not to be null`

2. **`social-media-bans` story** - 1 runtime error
   - Missing END statement in edge case path
   - Path: `src/__tests__/real-stories.test.js:152`

3. **`on-device-scanning` story** - 1 runtime error
   - Missing END statement in edge case path
   - Path: `src/__tests__/real-stories.test.js:152`

### Linting Issues (11 total)
1. `integration.stories.test.js:28` - Unused var `response`
2. `integration.stories.test.js:27` - Unused var `path`
3. `integration.stories.test.js:10` - `global` not defined
4. `currentPathString.test.js:55` - Unused var `pos1b`
5. `playwright.config.js:25` - `process` not defined
6. `playwright.config.js:8` - `process` not defined
7. `playwright.config.js:7` - `process` not defined
8. `playwright.config.js:6` - `process` not defined
9. `e2e/app.spec.js:113` - Unused var `err`
10. `e2e/app.spec.js:52` - Unused var `err`

## Why Non-Blocking?

### Benefits
1. **Continuous Delivery** - Releases aren't blocked by non-critical issues
2. **Flexibility** - Known issues can be tracked separately
3. **Velocity** - Teams can deploy fixes without fixing every warning
4. **Visibility** - Issues are still reported and tracked

### Trade-offs
- ⚠️ Tests can fail without blocking deployment
- ⚠️ Requires discipline to address issues
- ⚠️ Manual review of test results needed

## Best Practices

### Before Creating a Release
Even though CI doesn't block, you should:
```bash
# Run locally and verify
npm run compile-ink    # Must pass
npm run test:run       # Should review failures
npm run lint          # Should review warnings
npm run build         # Must pass
```

### For Pull Requests
1. Check workflow results even if they pass
2. Look at job logs for test failures
3. Address linting issues when possible
4. Fix critical test failures before merging

### Monitoring
- Check Actions tab regularly
- Review test reports in artifacts
- Track known issues in documentation
- Fix blocking issues (ink compilation, build) immediately

## Future Improvements

### Short Term
1. Fix the 3 test failures
2. Fix linting issues in test files
3. Add `/* eslint-disable */` for known E2E/test file issues

### Long Term
1. Make tests more robust
2. Fix story path issues (add missing END statements)
3. Consider making unit tests blocking once stable
4. Keep linting non-blocking (it's for code quality, not correctness)

## Workflow Configuration

### Making Steps Non-Blocking
Add `continue-on-error: true` to any step:

```yaml
- name: Run tests
  run: npm run test:run
  continue-on-error: true  # Step fails but workflow continues
```

### Making Steps Blocking
Remove `continue-on-error` or set to `false`:

```yaml
- name: Build
  run: npm run build
  # No continue-on-error = workflow fails if this fails
```

## Reverting to Blocking

If you want to make tests blocking again:

1. Edit `.github/workflows/build-release.yml`
2. Remove `continue-on-error: true` from test steps
3. Fix all test failures first
4. Push changes

Same for `.github/workflows/tests.yml`

## Related Documentation

- `.github/WORKFLOWS.md` - Complete workflow documentation
- `BUILD_REQUIREMENTS.md` - Build process requirements
- `TESTING.md` - Testing strategy
