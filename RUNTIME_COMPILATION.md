# Runtime Compilation Feature

## Overview

The What About app now supports **runtime compilation** of .ink story files, eliminating the need for a build step when adding or editing stories. This makes the tool accessible to non-technical content creators.

## How It Works

### 1. Automatic INCLUDE Resolution

The `loadInkStory()` function in `src/stories/index.js` now:
- Loads the main .ink file
- Recursively finds and resolves all `INCLUDE` statements
- Fetches included files from the server
- Combines them into a single source
- Compiles in the browser using inkjs

### 2. Optional Pre-compilation

For production performance optimization:
- Run `npm run compile-ink` to pre-compile stories to JSON
- The app will use pre-compiled .json files if available
- Falls back to runtime compilation if .json doesn't exist
- Pre-compiled files are gitignored

### 3. Zero-Build Workflow

Content creators can now:
1. Drop .ink files into `public/stories/{story-id}/`
2. Update `stories.txt`
3. Refresh browser - story works immediately!

No need to understand npm, build processes, or command-line tools.

## Implementation Details

**Key Function: `resolveIncludes(source, basePath)`**
- Uses regex to find `INCLUDE filename.ink` statements
- Fetches each included file via HTTP
- Recursively resolves nested includes
- Replaces INCLUDE statements with actual content
- Returns combined source ready for compilation

**Key Function: `loadInkStory(inkPath)`**
1. Tries to load pre-compiled .json (optional)
2. Falls back to loading .ink source
3. Resolves all includes
4. Compiles with inkjs Compiler
5. Returns compiled JSON for inkjs Story runtime

## Benefits

✅ **No compilation required** - Stories work immediately  
✅ **Non-technical friendly** - No npm/build knowledge needed  
✅ **Full INCLUDE support** - Multi-file stories work perfectly  
✅ **Optional optimization** - Can still pre-compile for production  
✅ **Development velocity** - Edit .ink, refresh browser, see changes  

## Performance Considerations

- **Runtime compilation**: ~100-500ms for medium stories
- **Pre-compiled**: Instant (just JSON parsing)
- **Recommendation**: Use runtime for development, pre-compile for production

## Technical Notes

- Uses `inkjs/compiler/Compiler` module (browser-compatible)
- INCLUDE resolution happens before compilation
- Compilation happens in main thread (could be moved to worker if needed)
- Errors and warnings are logged to console
- Failed includes throw errors (caught by error boundaries)

## Files Modified

- `src/stories/index.js` - Added `resolveIncludes()` and updated `loadInkStory()`
- `package.json` - Removed compile-ink from build script
- `README.md` - Updated to highlight no-build workflow
- `public/stories/README.md` - Simplified instructions for content creators
