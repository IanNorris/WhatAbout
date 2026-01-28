# Agent Reference - WhatAbout

**Quick reference for AI assistants and developers. Shorthand format.**

## Project Type
Interactive narrative web app. Stories in Ink, runtime compilation, React+Vite.

## Key Constraint
**MUST support loading .ink files directly in production.** JSON pre-compilation is optimization only, not requirement.

## Directory Map
```
WhatAbout/
├── public/
│   ├── stories/               # .ink story files
│   │   ├── stories.txt        # Story registry (what shows in hub)
│   │   └── {story-id}/        # Story folders (can have multiple .ink files)
│   └── assets/{story-id}/     # Images (618×337px, dark bg)
├── src/
│   ├── components/            # React components
│   ├── stories/               # Story metadata/config
│   └── App.jsx                # Main app
├── tools/                     # Dev utilities
│   ├── generate-image.js      # OpenRouter image gen
│   ├── analyze-ink.js         # Dead-end detection
│   ├── compile-ink.js         # Optional pre-compiler
│   └── IMAGE_STYLE_GUIDE.md   # ⭐ Required for images
└── .github/workflows/         # CI/CD (builds, tests, releases)
```

## File Locations

### Content
- **Story registry**: `public/stories/stories.txt`
- **Story source**: `public/stories/{id}/main.ink` (or any .ink name)
- **Images**: `public/assets/{id}/*.png`

### Dev Tools
- **Image gen**: `tools/generate-image.js` (needs `.env` with OPENROUTER_API_KEY)
- **Image style**: `tools/IMAGE_STYLE_GUIDE.md` (REQUIRED reading)
- **Analyzer**: `tools/analyze-ink.js`

### Build
- **Build reqs**: `BUILD_REQUIREMENTS.md` - CRITICAL: runtime .ink loading mandatory
- **Runtime details**: `RUNTIME_COMPILATION.md`

### Tests
- **Unit**: `src/__tests__/`
- **E2E**: `e2e/`
- **Fixtures**: `src/test/fixtures/`

## Common Tasks

### New Story
1. `mkdir public/stories/{id}`
2. Create `{id}/main.ink`
3. `mkdir public/assets/{id}`
4. Add to `public/stories/stories.txt`
5. Refresh browser - works immediately

### Generate Image
```bash
cd tools
node generate-image.js "prompt following IMAGE_STYLE_GUIDE.md" ../public/assets/{id}/name.png
```

### Validate Story
```bash
npm run analyze-ink public/stories/{id}/main.ink
```

### Tests
```bash
npm test              # watch
npm run test:run      # once
npm run test:e2e      # full E2E
```

## Ink Syntax Quick Reference

```ink
# Basic text
This is narrative text.

# Choices
* [Choice 1] -> knot_name        # Non-sticky
+ [Choice 2] -> knot_name        # Sticky (remains)

# Knots (sections)
=== knot_name ===
Content here.

# Variables
VAR topic_title = "Value"
{topic_title}                    # Display var

# Images (in narrative paragraph)
Text here. # diagram: filename.png

# Multi-file
INCLUDE section.ink              # At top of main.ink

# External functions
EXTERNAL exit()                  # Return to hub
EXTERNAL navigateTo(story_id)    # Jump to story

~ exit()                         # Call function
~ navigateTo("other-story")
```

## Common Ink Pitfalls

1. **`**text:**` at line start** → Ink treats as choice. Use `•` or indent.
2. **Non-sticky choices in exploration** → Add `+ [Continue]` exit choice.
3. **Missing END** → All paths need `-> END`, `-> DONE`, or exit choice.

## Image Requirements

- **Size**: 618×337px (exact)
- **Background**: Dark blue-black (#0f1419)
- **Style**: Clean diagrams, glowing soft colors, clear metaphors
- **Prompt**: Follow `tools/IMAGE_STYLE_GUIDE.md` strictly

## Build Process

```bash
npm run build         # Compiles .ink + builds bundle
```

**Blocks build:**
- Ink compilation errors
- Vite build failures

**Non-blocking (reports only):**
- Unit tests
- Linting
- E2E tests

## CI/CD

- **On push**: Build + tests
- **On PR**: Full validation
- **On tag** (`v*`): Creates GitHub release with archives

## NPM Scripts

```bash
npm run dev                # Dev server
npm run build              # Production build (includes ink compile)
npm run preview            # Test dist/ locally
npm run compile-ink        # Pre-compile .ink → .json (optional)
npm run compile-ink:watch  # Auto-compile on changes
npm run analyze-ink        # Dead-end detection
npm test                   # Tests (watch)
npm run test:run           # Tests (once)
npm run test:e2e           # E2E tests
npm run test:ui            # Visual test UI
npm run lint               # ESLint
```

## Story Registry Format

`public/stories/stories.txt`:
```
id: story-id
title: Display Title
description: Brief description
file: main.ink
release: true

# Blank line between entries
# release: true = prod, false = dev only
```

## Image Tags in Ink

```ink
This paragraph explains something. # diagram: image.png
```

Auto-loads from `public/assets/{story-id}/image.png`

## Path Discovery Test Pattern

Validates:
- All paths reach END or exit
- No runtime "out of content" errors
- All knots reachable (optional)

Common issues:
- Exhausted choices (add sticky `+` choice)
- Missing END statements

## Error Display

Runtime compilation errors → User-friendly UI messages:
- Missing files
- Compilation errors with line numbers
- INCLUDE resolution failures

Dev mode: console logs with emoji prefixes  
Prod mode: Only errors shown to users

## Deploy Checklist

```bash
npm run compile-ink    # Validate syntax
npm run test:run       # Unit tests
npm run lint           # Code quality
npm run build          # Build (fails if .ink errors)
npm run preview        # Test locally
# Deploy dist/ folder
```

## Known Issues (Tracked)

- 3 test failures (non-blocking)
- 11 linting warnings (non-blocking)
- 2 stories with edge-case path issues

## Dependencies

- React, Vite, inkjs (prod)
- Vitest, Playwright (dev)
- Keep inkjs in `dependencies` not `devDependencies` (runtime required)

## Workflows

- `.github/workflows/build-release.yml` - Main CI/CD
- `.github/workflows/tests.yml` - Comprehensive testing

## Exit Patterns

```ink
EXTERNAL exit()

* [I'm done]
    Thanks for reading!
    ~ exit()
    -> END
```

```ink
EXTERNAL navigateTo(story_id)

* [Related topic]
    Preview text...
    ~ navigateTo("other-id")
    -> END
```

## Debugging

1. **Story won't load**: Check console, verify path in stories.txt
2. **Dead ends**: `npm run analyze-ink`
3. **Images missing**: Check `public/assets/{id}/`, verify filename case
4. **Tests fail**: `npm run test:ui` for interactive debugging
5. **Build fails**: Check .ink syntax with `npm run compile-ink`

## Critical Don'ts

- ❌ Remove runtime .ink loading capability
- ❌ Make build depend on pre-compiled JSON only
- ❌ Remove inkjs from prod dependencies
- ❌ Use light backgrounds in images
- ❌ Forget IMAGE_STYLE_GUIDE.md when generating images

## Quick Orientation Flow

1. Read this file first
2. Check `tools/IMAGE_STYLE_GUIDE.md` if making images
3. Look at `public/stories/age-verification/` for example
4. Reference `public/stories/README.md` for full Ink guide
5. Check `BUILD_REQUIREMENTS.md` for deployment

## Story Structure Patterns

**Small** (< 500 lines):
```
stories/{id}/main.ink
```

**Large** (500+ lines):
```
stories/{id}/
├── main.ink           # Entry with INCLUDEs
├── section1.ink
├── section2.ink
└── conclusion.ink
```

## Testing Story Structure

```bash
npm run analyze-ink public/stories/{id}/main.ink
```

Reports:
- Paths without END
- Runtime errors
- Unreachable knots

## Image Generation Prompt Template

```
[specific metaphor with exact quantities], clean diagram style,
dark blue-black background (#0f1419), [exact labels needed],
[specific elements], friendly professional design,
glowing soft [colors], minimal composition, subtle texture,
easy to understand, avoid [specifics to avoid]
```

## Optimization

```bash
node tools/resize-images.js           # All images → 618×337px
node tools/resize-images.js {id}      # Specific folder
node tools/resize-images.js --dry-run # Preview changes
```

## Release Process

```bash
git tag v1.0.0
git push origin v1.0.0
# GitHub Actions auto-creates release
```

## Production Bundle

- Total: ~340KB JS (99KB gzipped)
- All .ink and .json files included
- Runtime compilation functional
- Images in `dist/assets/`

## Status: Production Ready

App is deployable. Known issues tracked but non-blocking.
