# GitHub Actions Workflows

This project uses GitHub Actions for automated building, testing, and releasing.

## Workflows

### 1. Build and Release (`build-release.yml`)

**Triggers:**
- Push to `main` branch
- Version tags (`v*`)
- Pull requests to `main`
- Manual workflow dispatch

**Jobs:**

#### Build
- Checks out code
- Sets up Node.js (20.x)
- Installs dependencies with `npm ci`
- Compiles all `.ink` files (validates syntax)
- Runs unit tests (non-blocking - reports only)
- Runs linter (non-blocking)
- Builds production bundle
- Archives build artifacts for 30 days

#### Test E2E
- Runs after successful build
- Installs Playwright browsers
- Runs end-to-end tests
- Uploads test reports on failure

#### Release (Tag pushes only)
- Downloads build artifacts
- Creates `.zip` and `.tar.gz` archives
- Creates GitHub release with:
  - Build archives attached
  - Auto-generated release notes
  - Version from tag name

**Usage:**
```bash
# Create a release
git tag v1.0.0
git push origin v1.0.0
```

### 2. Tests (`tests.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Any pull request
- Manual workflow dispatch

**Jobs:**

#### Unit Tests
- Runs on Node.js 18.x and 20.x
- Compiles ink files
- Runs unit tests
- Uploads coverage report (Node 20.x only)

#### E2E Tests
- Installs Playwright browsers
- Builds app
- Runs E2E tests
- Uploads Playwright report (always, even on failure)

#### Lint
- Runs ESLint checks
- Blocks on linting errors

**CI Status Checks:**
Tests run and report results but don't block builds or PRs. This allows development to continue while tests are being fixed.

## Artifacts

### Build Artifacts
- **Name**: `dist-{commit-sha}`
- **Contents**: Production build (`dist/` folder)
- **Retention**: 30 days
- **Size**: ~5-10 MB (after optimization)

### Test Reports
- **Playwright reports**: `playwright-report-{commit-sha}`
- **Coverage reports**: `coverage-report`
- **Retention**: 7 days

### Release Assets
- `whatabout-v{version}.zip` - Production build (Windows/macOS)
- `whatabout-v{version}.tar.gz` - Production build (Linux)

## Workflow Status Badges

Add to `README.md`:

```markdown
[![Build](https://github.com/username/WhatAbout/actions/workflows/build-release.yml/badge.svg)](https://github.com/username/WhatAbout/actions/workflows/build-release.yml)
[![Tests](https://github.com/username/WhatAbout/actions/workflows/tests.yml/badge.svg)](https://github.com/username/WhatAbout/actions/workflows/tests.yml)
[![Pages](https://github.com/username/WhatAbout/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/username/WhatAbout/actions/workflows/deploy-pages.yml)
```

## Local Testing

Test what CI will do locally:

```bash
# Install dependencies (like CI)
npm ci

# Run the build process
npm run compile-ink
npm run test:run
npm run build

# Run E2E tests
npx playwright install --with-deps
npm run test:e2e
```

## Troubleshooting

### Build fails on "Compile Ink files"
- Check `.ink` file syntax errors locally: `npm run compile-ink`
- Fix any compilation errors in story files

### Unit tests fail
- Run locally: `npm run test:run`
- Check test output for specific failures
- Most common: missing END statements in stories

### E2E tests fail
- Download Playwright report artifact from failed workflow
- View report: `npx playwright show-report playwright-report/`
- Run locally: `npm run test:e2e`

### Deployment fails
- Check Actions tab for specific error
- Verify workflow syntax is valid
- Ensure dependencies install correctly

### Release not created
- Verify tag format starts with `v` (e.g., `v1.0.0`)
- Check workflow has `contents: write` permission
- Ensure tag is pushed: `git push origin v1.0.0`

## Security

### Secrets
No secrets are required for these workflows. They use:
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- Node.js public packages only
- No API keys or external services

### Permissions
Workflows use minimal permissions:
- `contents: read` - Read repository code
- `contents: write` - Create releases (release job only)

## Performance

### Build Times (Approximate)
- **Install dependencies**: 30-45 seconds (with cache)
- **Compile ink files**: 2-3 seconds
- **Unit tests**: 3-5 seconds
- **Build**: 5-10 seconds
- **E2E tests**: 30-60 seconds
- **Total**: ~2-3 minutes

### Optimization
- `npm ci` with caching (faster than `npm install`)
- Parallel test execution where possible
- Artifact uploads only on success/failure
- Separate E2E tests (can be skipped for quick checks)

## Advanced Usage

### Manual Workflow Dispatch

Trigger workflows manually from GitHub:
1. Go to Actions tab
2. Select workflow
3. Click "Run workflow"
4. Choose branch
5. Click "Run workflow" button

### Skip CI

Add to commit message to skip workflow:
```
git commit -m "docs: update README [skip ci]"
```

### Conditional Jobs

Workflows already configured with:
- E2E tests run only after build succeeds
- Release only on version tags
- Coverage upload only on Node 20.x

## Maintenance

### Updating Dependencies

GitHub Actions versions are pinned:
- `actions/checkout@v4`
- `actions/setup-node@v4`
- `actions/upload-artifact@v4`

Update periodically:
```yaml
uses: actions/checkout@v5  # When v5 is released
```

### Adding New Workflows

1. Create `.github/workflows/your-workflow.yml`
2. Follow existing patterns
3. Test with manual trigger first
4. Document in this file

## Related Documentation

- `BUILD_REQUIREMENTS.md` - Build process requirements
- `DEPLOYMENT.md` - Deployment workflow
- `TESTING.md` - Testing strategy
