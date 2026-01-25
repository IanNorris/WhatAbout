# Runtime Compilation Feature

## Overview

The What About app now supports **runtime compilation** of .ink story files with full INCLUDE support, eliminating the need for a build step when adding or editing stories.

## How It Works

### 1. Automatic INCLUDE Resolution

The `resolveIncludes()` function:
- Finds all `INCLUDE filename.ink` statements
- Fetches each included file via HTTP
- Recursively resolves nested includes
- **Appends** all included content at the end (preserving root flow)
- Returns combined source ready for compilation

**Key insight**: Ink knot definitions can appear anywhere in the file, so we append INCLUDEs at the end to keep the main story flow at the beginning.

### 2. Runtime Compilation

The `loadInkStory()` function:
1. Tries to load pre-compiled .json (optional optimization)
2. Falls back to loading .ink source
3. Resolves all INCLUDE statements
4. Compiles with inkjs Compiler
5. Returns compiled JSON for inkjs Story runtime

### 3. User-Friendly Error Messages

Errors are surfaced to users with helpful context:

**Missing Include File:**
```
Could not find file: vpn.ink

Make sure the file exists in the same folder as your main story file.
Path attempted: /stories/age-verification/vpn.ink
```

**Compilation Errors:**
```
Story has compilation errors:

  1. ERROR: line 15: Expected choice text after '* ['
  2. ERROR: line 23: Unrecognized statement

Please fix these issues in your .ink file.
```

**File Not Found:**
```
Could not load story file: /stories/my-story/main.ink

Please make sure the file exists and the path is correct.
```

### 4. Development Mode Logging

When `import.meta.env.DEV` is true:
- ✅ Shows compilation success messages
- 📄 Indicates when pre-compiled JSON is used
- 🔨 Shows when runtime compilation occurs
- 📝 Logs warnings (loose ends, etc.)

In production, only errors are shown to users.

## Benefits

✅ **No compilation required** - Stories work immediately  
✅ **Non-technical friendly** - No npm/build knowledge needed  
✅ **Full INCLUDE support** - Multi-file stories work perfectly  
✅ **Helpful error messages** - Clear guidance when things go wrong  
✅ **Optional optimization** - Can pre-compile for production  
✅ **Development velocity** - Edit .ink, refresh browser, see changes

## Implementation Details

### Include Resolution Strategy

The original attempt replaced INCLUDE statements inline, which caused issues:
- Included knots with `-> END` statements terminated the root flow
- Main story content became unreachable

**Solution**: Remove INCLUDE statements and append all included content at the end. This ensures:
- Root flow starts immediately after VARs
- Main story content runs first
- Knot definitions are available when referenced

### Error Handling

Three layers of error handling:
1. **Fetch errors** - Missing files, network issues
2. **Resolution errors** - Nested INCLUDE problems
3. **Compilation errors** - Ink syntax issues

Each provides user-friendly messages instead of technical stack traces.

### Console Logging

Development mode provides visibility without cluttering production:
- `console.log` with emoji prefixes (📄, 🔨, 📝, ✅)
- `console.info` for warnings (less alarming than `console.warn`)
- `console.error` always shows errors (both dev and prod)

## Files Modified

- `src/stories/index.js` - Added `resolveIncludes()`, improved error handling
- `src/components/Hub.jsx` - Enhanced error display with styling
- `package.json` - Removed compile-ink from build script
- `README.md` - Added error handling documentation
- `public/stories/README.md` - Simplified instructions for creators

## Testing

Runtime compilation tested with:
- ✅ age-verification story (5 includes, 8,739 characters resolved)
- ✅ demo story (1 include)
- ✅ Compilation produces valid 11,277 character JSON
- ✅ Stories load and run correctly in browser
- ✅ Error messages display properly in UI

## Performance

- **Runtime compilation**: ~100-500ms for medium stories
- **Pre-compiled JSON**: Instant (just parsing)
- **Recommendation**: Use runtime for development, optionally pre-compile for production

The tool is now truly accessible to non-technical content creators!
