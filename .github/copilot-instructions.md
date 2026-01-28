# GitHub Copilot Instructions - WhatAbout

## Project Context

**WhatAbout** is an interactive narrative web app using React + Vite + Ink scripting language. Stories are written in `.ink` files and compiled at runtime in the browser. This enables non-technical content creators to add stories without build steps.

## Critical Architecture Constraint

**The app MUST support loading `.ink` files directly in production.**

- Runtime compilation via `inkjs` is MANDATORY, not optional
- Pre-compiled `.json` files are performance optimization only
- Never suggest removing runtime compilation capability
- Never move `inkjs` to devDependencies

## Project Structure

```
WhatAbout/
├── public/
│   ├── stories/              # .ink story source files
│   │   ├── stories.txt       # Story registry (human-editable)
│   │   └── {story-id}/       # Story folders (can use INCLUDE)
│   └── assets/{story-id}/    # Images (618×337px)
├── src/
│   ├── components/           # React components
│   ├── stories/              # Story loading logic
│   └── App.jsx               # Main app
├── tools/                    # Dev utilities
│   ├── generate-image.js     # Image generation via OpenRouter
│   ├── analyze-ink.js        # Dead-end detection
│   └── IMAGE_STYLE_GUIDE.md  # Visual style guide
└── .github/workflows/        # CI/CD automation
```

## When Working on Stories

### Adding New Stories
1. Create folder: `public/stories/{id}/`
2. Create `.ink` file(s) in that folder
3. Add images to `public/assets/{id}/`
4. Register in `public/stories/stories.txt`
5. No build step needed - refresh browser

### Story Format
- Stories use [Ink scripting language](https://github.com/inkle/ink)
- See `public/stories/README.md` for complete syntax guide
- Images: `# diagram: filename.png` in narrative paragraphs
- Multi-file: Use `INCLUDE section.ink` in main file

### Common Ink Pitfalls
1. **`**text:**` at line start**: Ink treats as choice. Use `•` or indent instead.
2. **Exploration sections**: Always provide sticky exit choice (`+ [Continue]`)
3. **All paths need endpoints**: `-> END`, `-> DONE`, `~ exit()`, or next choice

### Validation
```bash
npm run analyze-ink public/stories/{id}/main.ink
```

## When Working on Images

### Requirements
- **Size**: Exactly 618×337px
- **Background**: Dark blue-black (#0f1419)
- **Style**: Clean diagrams, glowing colors, clear metaphors
- **Format**: PNG or optimized JPEG

### Before Generating Images
**ALWAYS read `tools/IMAGE_STYLE_GUIDE.md` first.** It contains:
- Prompt templates
- Color palette
- Visual style requirements
- Common mistakes to avoid

### Generating Images
```bash
cd tools
node generate-image.js "detailed prompt" ../public/assets/{id}/filename.png
```

### Optimizing Images
```bash
node tools/resize-images.js        # Batch optimize to 618×337px
```

## When Modifying Code

### Testing Requirements
```bash
npm test              # Unit tests (watch mode)
npm run test:run      # Unit tests (once)
npm run test:e2e      # End-to-end tests
```

### Before Committing
```bash
npm run compile-ink   # Validate all .ink syntax
npm run test:run      # Run unit tests
npm run lint          # Check code quality
```

### Build Process
```bash
npm run build         # Compiles ink + builds bundle
```

**Build-blocking errors:**
- Ink compilation failures
- Vite build errors

**Non-blocking (reports only):**
- Test failures
- Linting warnings

## Key Files to Reference

### For Story Work
- `public/stories/README.md` - Complete Ink authoring guide
- `tools/IMAGE_STYLE_GUIDE.md` - Visual style requirements (REQUIRED)
- `STORY_AUTHORING.md` - Common pitfalls and patterns

### For Development
- `AGENT_REFERENCE.md` - Quick reference (shorthand)
- `BUILD_REQUIREMENTS.md` - Build process and constraints
- `TESTING.md` - Testing strategy and framework

### For Deployment
- `DEPLOYMENT.md` - Deployment workflow
- `.github/WORKFLOWS.md` - CI/CD documentation

## Common Workflows

### Creating a New Story
1. Read existing story in `public/stories/age-verification/` for reference
2. Create story folder and `.ink` files
3. Generate images following IMAGE_STYLE_GUIDE.md
4. Add to stories.txt
5. Test with `npm run dev`
6. Validate with `npm run analyze-ink`
7. Test paths manually in browser

### Fixing Story Dead Ends
1. Run `npm run analyze-ink public/stories/{id}/main.ink`
2. Identify paths without END statements
3. Add sticky exit choices: `+ [Continue] -> next_section`
4. Re-run analyzer to verify

### Modifying Story Loading
**BE CAREFUL**: This is core functionality.
- Never break runtime `.ink` loading
- Test both `.ink` and `.json` loading paths
- Verify INCLUDE resolution works
- Check error messages are user-friendly

## Code Style

### React Components
- Functional components with hooks
- CSS Modules for styling
- PropTypes for type checking (or TypeScript if migrated)

### Story Loading
- Located in `src/stories/index.js`
- Handles both .ink and .json loading
- Resolves INCLUDE statements recursively
- Provides user-friendly error messages

### Tests
- Vitest for unit tests
- Playwright for E2E tests
- Path discovery algorithm in `src/test/pathDiscovery.js`

## CI/CD

### Automated on Push
- Compile all .ink files (validation)
- Run tests (non-blocking)
- Run linter (non-blocking)
- Build production bundle
- Run E2E tests

### Automated on Tag (`v*`)
- All above steps
- Create GitHub release
- Attach build archives (.zip, .tar.gz)

### Manual Release
```bash
git tag v1.0.0
git push origin v1.0.0
```

## External Functions (Ink)

Stories can use these external functions:

```ink
EXTERNAL exit()                    # Return to hub with 3s delay
EXTERNAL navigateTo(story_id)      # Jump to another story

~ exit()                           # Call to return
~ navigateTo("other-story")        # Call to navigate
```

Always provide farewell message before `exit()`, preview before `navigateTo()`.

## Story Registry Format

`public/stories/stories.txt`:
```
id: unique-id
title: Display Title
description: Brief description (< 100 chars)
file: main.ink
release: true

# release: true = production visible
# release: false = dev only
```

## Image Reference in Ink

```ink
This paragraph describes something complex. # diagram: image_name.png
```

Auto-loads from `public/assets/{story-id}/image_name.png`

## Dependencies

### Production
- React, Vite
- **inkjs** (MUST stay in prod dependencies)
- CSS Modules

### Development
- Vitest (unit tests)
- Playwright (E2E tests)
- ESLint (linting)

## Known Issues (Non-Blocking)

- 3 test failures in edge cases (tracked)
- 11 linting warnings (mostly test files)
- 2 stories with missing END in rare paths

These don't prevent deployment but should be addressed when possible.

## Best Practices

### When Suggesting Code Changes
1. Maintain runtime .ink loading capability
2. Keep error messages user-friendly
3. Test both .ink and .json loading paths
4. Validate with tests before committing

### When Creating Stories
1. Follow IMAGE_STYLE_GUIDE.md for all images
2. Use analyze-ink tool to find dead ends
3. Test all choice paths manually
4. Set `release: false` until ready

### When Generating Images
1. **Read IMAGE_STYLE_GUIDE.md first** (critical)
2. Use specific prompts with exact labels
3. Always specify dark background
4. Include quantity and arrangement details

## Project Goals

- **Accessibility**: Non-technical users can add stories
- **No Build Step**: Stories work immediately after adding
- **Runtime Compilation**: Full INCLUDE support in browser
- **Clear Errors**: User-friendly messages, not stack traces
- **Quality Visuals**: Consistent style across all images

## What Makes This Project Unique

1. **Runtime Ink Compilation**: Most Ink apps pre-compile. We compile in browser.
2. **No Build for Content**: Content creators never touch npm.
3. **Full INCLUDE Support**: Multi-file stories work at runtime.
4. **User-Friendly Errors**: Compilation errors shown in UI, not console.

## Suggestions Welcome For

- Story structure improvements
- Testing enhancements
- Code quality improvements
- Documentation clarity
- Performance optimizations (that don't break runtime loading)

## Suggestions to Avoid

- Removing runtime .ink loading
- Making build process depend on pre-compiled JSON only
- Moving inkjs to devDependencies
- Changing core story loading logic without careful testing
- Breaking INCLUDE resolution

## Questions to Ask When Uncertain

1. Will this break runtime .ink loading?
2. Have I read the relevant documentation file?
3. Have I tested both .ink and .json loading?
4. Are error messages still user-friendly?
5. For images: Have I followed IMAGE_STYLE_GUIDE.md?

## Quick Reference Files

- **Start here**: `AGENT_REFERENCE.md` (shorthand reference)
- **Users/content creators**: `USER_GUIDE.md` (friendly onboarding)
- **Full details**: Individual docs (TESTING.md, BUILD_REQUIREMENTS.md, etc.)

---

**Remember**: This project prioritizes accessibility for non-technical content creators. Changes should maintain or enhance that goal.
