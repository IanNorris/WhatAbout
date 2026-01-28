# Build Requirements

## Critical: Direct Ink File Loading

**The application MUST be able to load `.ink` files directly in production builds.**

This is a mandatory feature. The compiled `.json` files are:
- An optimization for faster loading
- Used for development convenience
- **NOT** a replacement for direct ink file loading

### Why This Matters

1. **Runtime Flexibility**: Stories can be updated without recompiling
2. **Development Workflow**: Content authors can iterate without build steps
3. **Debugging**: Direct ink loading makes issues easier to trace
4. **Future-Proofing**: Keeps the option for dynamic story loading

### Implementation

The app uses `inkjs` compiler at runtime to load `.ink` files. The compiled `.json` files are a fallback optimization, not a requirement.

**Do NOT:**
- Remove runtime ink compilation capability
- Make the build process dependent on pre-compiled JSON files only
- Assume JSON files will always be present

**Do:**
- Keep inkjs compiler in production dependencies
- Maintain ability to load from `.ink` source files
- Use `.json` files as an optimization when available

## Build Process Requirements

### Pre-Build Checks

Before building, the following must pass:

1. **Ink Compilation** (`npm run compile-ink`)
   - All `.ink` files must compile without errors
   - Generates optimized `.json` files for production
   - Validates story syntax and structure

2. **Unit Tests** (`npm run test:run`)
   - Core functionality tests must pass
   - Story structure validation tests must pass
   - E2E tests are NOT required for build (run separately)
   
**Note:** Some stories may have runtime path completion issues (missing END statements in edge case paths). These are tracked separately and do not block builds, as they don't prevent the app from functioning.

### Build Command

```bash
npm run build
```

This automatically runs:
1. `prebuild` hook → compiles all ink files (validates syntax)
2. `build` → Vite production build

### Build Failure Conditions

The build will fail if:
- ❌ Any `.ink` file has compilation/syntax errors
- ❌ Vite build fails

Tests should be run separately before deploying:
```bash
npm run test:run       # Unit tests
npm run test:e2e       # E2E tests (slower)
```

## Development Workflow

### During Development
```bash
# Run dev server (no pre-checks needed)
npm run dev

# Watch for ink file changes and auto-compile
npm run compile-ink:watch
```

### Before Committing
```bash
# Verify everything works
npm run compile-ink
npm run test:run
npm run lint
```

### For Production Deploy
```bash
# Single command runs all checks and builds
npm run build
```

## Continuous Integration

CI/CD pipelines should:

1. **On every commit:**
   - Run `npm run test:run` (unit tests)
   - Run `npm run lint`
   - Run `npm run compile-ink` (validation)

2. **Before deployment:**
   - Run `npm run build` (includes all checks)
   - Run `npm run test:e2e` (full integration tests)

3. **On deployment:**
   - Deploy both `.ink` and `.json` files
   - Ensure runtime ink compiler is available

## Troubleshooting

### "Compilation failed" during build
- Check `.ink` file syntax
- Run `npm run compile-ink` to see specific errors
- Use `npm run analyze-ink` to find dead ends

### Tests fail during build
- Run `npm test` to see which tests fail
- Fix the failing tests before building
- Use `npm run test:ui` for interactive debugging

### Build succeeds but stories don't load
- Verify `.ink` files are included in build output
- Check that inkjs is in `dependencies` not `devDependencies`
- Confirm runtime compilation is working

## Related Documentation

- `PROJECT_GUIDE.md` - Project structure and development guide
- `TESTING.md` - Testing strategy and test details
- `public/stories/README.md` - Story authoring guide
- `RUNTIME_COMPILATION.md` - Details on runtime ink compilation
