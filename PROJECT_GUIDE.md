# What About - Project Guide

**Quick orientation guide for developers, AI assistants, and contributors.**

## 🎯 What This Project Does

An interactive web app that explores complex topics through conversational narratives. Users navigate through branching stories written in Ink (a scripting language for interactive narratives).

## 📁 Project Structure

```
WhatAbout/
├── public/
│   ├── stories/               # Story content (Ink files)
│   │   ├── stories.txt        # Story registry - controls what appears in hub
│   │   ├── age-verification/  # Stories organized by topic in folders
│   │   │   ├── main.ink       # Entry point
│   │   │   ├── vpn.ink        # Sections as separate files
│   │   │   └── ...
│   │   └── README.md          # Complete guide to writing stories
│   └── assets/                # Images for stories
│       └── age-verification/  # Images organized by story ID
│           ├── happy_Internet.png
│           └── ...
├── src/
│   ├── components/            # React components
│   ├── stories/               # Story metadata/config
│   └── App.jsx                # Main app
├── tools/                     # Development utilities
│   ├── IMAGE_STYLE_GUIDE.md   # ⭐ Visual style guide for images
│   ├── generate-image.js      # Image generation via OpenRouter API
│   ├── compile-ink.js         # Ink story compiler
│   └── analyze-ink.js         # Dead-end detection
└── README.md                  # Basic project overview
```

## 🔑 Key Files & Locations

### For Content Creation
- **`public/stories/stories.txt`** - Story registry (add new stories here)
- **`public/stories/README.md`** - Complete Ink writing guide
- **`tools/IMAGE_STYLE_GUIDE.md`** - Visual style for all images

### For Image Generation
- **`tools/generate-image.js`** - Script with OpenRouter API access
- **`tools/resize-images.js`** - Batch resize images to standard 618x337px
- **`tools/IMAGE_STYLE_GUIDE.md`** - Required reading before generating images
- **`.env`** - Contains OPENROUTER_API_KEY (in repo root, gitignored)

### For Development
- **`tools/analyze-ink.js`** - Find dead ends in stories
- **`tools/compile-ink.js`** - Pre-compile for production (optional)

## 🎨 Working with Images

### Image Style Requirements
All images MUST follow `tools/IMAGE_STYLE_GUIDE.md`:
- Dark blue-black background (#0f1419)
- Clean diagram style
- Friendly professional tone
- Soft glowing colors (blues, teals, ambers)
- Clear visual metaphors

### Generating Images

```bash
cd tools
node generate-image.js "your prompt here" ../public/assets/story-id/filename.png
```

**Important:** Always reference IMAGE_STYLE_GUIDE.md for prompt structure.

### Image Naming Convention
- Use descriptive names: `vpn_bypass.png`, not `image1.png`
- Lowercase with underscores
- NO version suffixes (~~`_v2`~~, ~~`_final`~~)
- Save to: `public/assets/{story-id}/`

### Adding Images to Stories

In your .ink file:
```ink
This paragraph has an image. # diagram: filename.png
```

The app automatically looks in `public/assets/{story-id}/` for the file.

## 📝 Adding a New Story

1. **Create folder:** `public/stories/my-story-id/`
2. **Write story:** `my-story-id/main.ink` (can INCLUDE other .ink files)
3. **Create assets folder:** `public/assets/my-story-id/`
4. **Add images:** Generate following IMAGE_STYLE_GUIDE.md
5. **Register story:** Edit `public/stories/stories.txt`:
   ```
   id: my-story-id
   title: My Story Title
   description: A brief description
   file: main.ink
   release: true
   ```
6. **Test:** `npm run dev` - No build step needed!

See `public/stories/README.md` for complete Ink syntax guide.

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server (stories auto-compile)
npm run build            # Production build
npm run lint             # Run ESLint

# Story Tools
npm run analyze-ink public/stories/my-story/main.ink  # Find dead ends
npm run compile-ink      # Optional: pre-compile all stories to JSON
npm run compile-ink:watch # Auto-compile on changes

# Image Generation
cd tools
node generate-image.js "prompt" ../public/assets/story-id/image.png
```

## 🎭 Story Development Workflow

### 1. Plan Your Story
- Outline the narrative structure
- Identify key decision points
- Sketch visual metaphors for complex concepts

### 2. Write in Ink
- Start with `main.ink` in `public/stories/your-story-id/`
- Use INCLUDE to split large stories into sections
- Add `# diagram: filename.png` tags where visuals help

### 3. Generate Images
- Read `tools/IMAGE_STYLE_GUIDE.md` FIRST
- Use `tools/generate-image.js` with detailed prompts
- Save to `public/assets/your-story-id/`

### 4. Test & Iterate
- Run `npm run dev` and click through your story
- Run `npm run analyze-ink` to find dead ends
- Fix any missing choices or END statements

### 5. Register Story
- Add entry to `public/stories/stories.txt`
- Set `release: false` for dev-only
- Set `release: true` when ready for production

## 📐 Story Structure Patterns

### Small Stories (< 500 lines)
```
public/stories/my-story/
└── main.ink              # Everything in one file
```

### Large Stories (500+ lines)
```
public/stories/my-story/
├── main.ink              # Entry point with INCLUDEs
├── section1.ink          # Topic sections
├── section2.ink
└── conclusion.ink
```

**Example (age-verification):**
```
├── main.ink              # Entry & loophole section
├── vpn.ink               # VPN-related knots
├── ai_privacy.ink        # AI & privacy knots
├── enforcement.ink       # App enforcement knots
├── alternatives.ink      # Alternative solutions
└── conclusion.ink        # Final thoughts
```

## 🔍 Debugging Stories

### Story won't load?
1. Check browser console for errors
2. Verify file path in stories.txt matches actual file
3. Check for Ink syntax errors

### Dead ends?
```bash
npm run analyze-ink public/stories/your-story/main.ink
```

### Images not showing?
1. Verify file exists in `public/assets/{story-id}/`
2. Check filename matches exactly (case-sensitive)
3. Ensure `# diagram: filename.png` tag format is correct

## 🚀 Production Deployment

```bash
npm run build            # Creates dist/ folder
# Deploy dist/ folder to hosting
```

**Optional:** Pre-compile stories for faster load times:
```bash
npm run compile-ink      # Before build
npm run build
```

## 🤖 For AI Assistants

When starting a new conversation:

1. **Check this file first** for project orientation
2. **Read `tools/IMAGE_STYLE_GUIDE.md`** before generating any images
3. **Reference `public/stories/README.md`** for Ink syntax
4. **Look at existing stories** in `public/stories/age-verification/` for examples

### Common Tasks & Locations

| Task | Location | Key Files |
|------|----------|-----------|
| Generate images | `tools/` | `IMAGE_STYLE_GUIDE.md`, `generate-image.js` |
| Write/edit stories | `public/stories/{id}/` | Any `.ink` files |
| Add new story | `public/stories/` | `stories.txt` |
| Create visuals | `public/assets/{id}/` | PNG files |
| Analyze story | `tools/` | `analyze-ink.js` |

### Image Generation Quick Reference

1. Read `tools/IMAGE_STYLE_GUIDE.md`
2. Create detailed prompt following guide
3. Run: `cd tools && node generate-image.js "prompt" ../public/assets/story-id/name.png`
4. Add to .ink: `Text here. # diagram: name.png`

### Common Pitfalls

❌ **Don't:**
- Add version suffixes to images (`_v2`, `_final`)
- Use light backgrounds in images
- Forget to check IMAGE_STYLE_GUIDE.md
- Modify .ink files without testing with `npm run dev`

✅ **Do:**
- Follow IMAGE_STYLE_GUIDE.md strictly
- Test stories locally before committing
- Use descriptive image names
- Keep this guide updated when structure changes

## 📖 Additional Documentation

- **`README.md`** - Project overview & quick start
- **`public/stories/README.md`** - Complete Ink writing guide
- **`tools/IMAGE_STYLE_GUIDE.md`** - Image generation guidelines
- **`tools/README.md`** - Tool-specific documentation
- **`RUNTIME_COMPILATION.md`** - Technical details on Ink compilation
- **`DISTRIBUTION.md`** - Distribution and packaging guide

## 🆘 Getting Help

1. Check relevant README files above
2. Look at existing stories for examples
3. Run analysis tools to debug
4. Check browser console for errors

## 🔄 Keeping This Guide Updated

This guide should be updated when:
- New tools are added
- Project structure changes significantly
- New workflows are established
- Common pitfalls are discovered

**Last Updated:** January 25, 2026
