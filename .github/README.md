# GitHub Configuration

This directory contains GitHub-specific configuration for the WhatAbout project.

## Contents

### Workflows

Automated CI/CD workflows for building, testing, and deploying:

- **`build-release.yml`** - Main build and release workflow
  - Builds on push to main, PRs, and version tags
  - Runs tests and linting
  - Creates GitHub releases for version tags
  - Archives build artifacts

- **`deploy-pages.yml`** - Deploy to GitHub Pages
  - Automatically deploys to GitHub Pages on main branch
  - Perfect for hosting the live app

- **`tests.yml`** - Comprehensive testing
  - Unit tests on multiple Node versions
  - E2E tests with Playwright
  - Linting checks
  - Runs on PRs and pushes

### Documentation

- **`WORKFLOWS.md`** - Complete documentation for all workflows
  - Detailed explanation of each workflow
  - Setup instructions
  - Troubleshooting guide
  - Best practices

## Quick Start

### For Contributors

Workflows run automatically on:
- Every pull request
- Every push to main/develop
- When you create version tags

No manual setup required!

### For Maintainers

#### Enable GitHub Pages Deployment
1. Go to Settings → Pages
2. Set Source to "GitHub Actions"
3. Done! Site deploys automatically

#### Create a Release
```bash
git tag v1.0.0
git push origin v1.0.0
```

The workflow will automatically:
1. Build the app
2. Run all tests
3. Create a GitHub release
4. Attach build archives

## Status

Check workflow status in the [Actions tab](../../actions).

Add badges to README:
```markdown
[![Build](https://github.com/YOUR_USERNAME/WhatAbout/actions/workflows/build-release.yml/badge.svg)](https://github.com/YOUR_USERNAME/WhatAbout/actions/workflows/build-release.yml)
```

## More Information

See `WORKFLOWS.md` for complete documentation.
