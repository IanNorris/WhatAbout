# WhatAbout - User Guide

**An interactive web app for exploring complex topics through conversational narratives.**

## 🚀 Quick Start

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:5173 and start exploring!

## 📝 Adding a New Story

### Simple Process
1. **Create story folder**: `public/stories/my-topic/`
2. **Write your story**: Create `main.ink` in that folder
3. **Add images**: Place in `public/assets/my-topic/`
4. **Register story**: Edit `public/stories/stories.txt`:
   ```
   id: my-topic
   title: My Topic
   description: An interesting discussion
   file: main.ink
   release: true
   ```
5. **Refresh browser** - Your story is live!

No build step, no compilation required. Stories work immediately!

## 📚 Writing Stories in Ink

### Basic Syntax
```ink
This is narrative text that appears on screen.

* [First choice]
    Response to first choice.
* [Second choice]
    Response to second choice.
```

### Adding Images
```ink
This paragraph has a visual. # diagram: my_image.png
```

Images load automatically from `public/assets/{story-id}/`

### Multi-File Stories
For large stories, split into sections:

**main.ink:**
```ink
Introduction text here...

INCLUDE section1.ink
INCLUDE section2.ink
```

**section1.ink:**
```ink
=== first_section ===
Content for the first section...
```

### Exiting to Hub
```ink
EXTERNAL exit()

* [I'm finished]
    Thanks for learning with us! Feel free to explore other topics.
    ~ exit()
    -> END
```

Shows farewell message for 3 seconds, then returns to hub.

### Cross-Linking Stories
```ink
EXTERNAL navigateTo(story_id)

* [Learn about related topic]
    Let's explore that...
    ~ navigateTo("related-story-id")
    -> END
```

Users can return via "Exit to [Parent]" in menu.

## 🎨 Image Requirements

### Standard Size
**618 × 337 pixels** - All images resized to this dimension.

### Visual Style
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

**Always reference `tools/IMAGE_STYLE_GUIDE.md` for prompt structure.**

### Optimizing Images
```bash
# Optimize all images to 618×337px
node tools/resize-images.js

# Optimize specific folder
node tools/resize-images.js age-verification
```

## 🛠 Development Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run linter
npm run test             # Run test suite
npm run analyze-ink      # Analyze story for dead ends
```

## 🧪 Testing Your Story

### Validate Structure
```bash
npm run analyze-ink public/stories/my-story/main.ink
```

Finds:
- Dead ends (no choices available)
- Runtime errors
- Unreachable sections

### Run Full Tests
```bash
npm run test             # Watch mode
npm run test:run         # Run once
npm run test:ui          # Visual UI
npm run test:e2e         # End-to-end tests
```

## ⚠️ Common Pitfalls

### 1. Markdown Bold at Line Start
**Problem**: `**text:**` at line start becomes a choice!

❌ **Bad:**
```ink
**Images:** Description here
**Text:** More description
```

✅ **Good:**
```ink
• Images: Description here
• Text: More description
```

### 2. Non-Sticky Choices in Exploration Sections
**Problem**: Users exhaust all choices and get stuck.

✅ **Solution**: Add sticky exit choice (`+`)
```ink
* [Option A] -> Detail_A
* [Option B] -> Detail_B
+ [I understand. Continue.] -> Next_Section
```

## 🚀 Building for Production

```bash
npm run build
```

This automatically:
1. Compiles all `.ink` files (validates syntax)
2. Builds production bundle
3. Outputs to `dist/` folder

**Pre-deployment checks:**
```bash
npm run test:run         # Unit tests
npm run test:e2e         # E2E tests (optional)
npm run lint             # Code quality
```

## 📦 Deployment

### Static Hosting
Upload `dist/` folder to:
- **Netlify**: Drag and drop
- **Vercel**: `vercel --prod`
- **GitHub Pages**: Push to gh-pages branch
- **AWS S3**: Upload to configured bucket

### Preview Build Locally
```bash
npm run preview          # Serves dist/ at http://localhost:4173
```

### SPA Routing Setup
Create `public/_redirects` (Netlify):
```
/*    /index.html   200
```

## 📖 Story Registry Format

Edit `public/stories/stories.txt`:

```
id: unique-story-id
title: Display Title
description: Brief description (under 100 chars)
file: main.ink
release: true

# release: true  - Shows in production
# release: false - Dev only (hidden in production)
```

## 🎯 Story Development Checklist

Before committing a new story:
- [ ] No `**text:**` at start of lines
- [ ] Exploration sections have sticky exit choice (`+`)
- [ ] All images exist in `public/assets/{story-id}/`
- [ ] Images follow style guide (618×337px, dark background)
- [ ] Run `npm run analyze-ink` - no dead ends
- [ ] Test in browser with `npm run dev`
- [ ] Entry added to `stories.txt`

## 🔧 Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **inkjs** - Ink story runtime and compiler
- **CSS Modules** - Scoped styling

## 🐛 Error Messages

The app shows clear error messages when things go wrong:

### Missing Include Files
```
Could not find file: section1.ink
Make sure the file exists in the same folder as your main story file.
```

### Compilation Errors
```
Story has compilation errors:
  1. ERROR: line 15: Expected choice text after '* ['
  2. ERROR: line 23: Unrecognized statement
```

### File Not Found
```
Could not load story file: /stories/my-story/main.ink
Please make sure the file exists and the path is correct.
```

## 📚 Additional Resources

- [Ink Documentation](https://github.com/inkle/ink) - Official Ink language guide
- `STORY_AUTHORING.md` - Complete authoring guide with patterns
- `tools/IMAGE_STYLE_GUIDE.md` - Visual style requirements
- `TESTING.md` - Full testing documentation

## 🆘 Getting Help

1. Check browser console for errors
2. Run `npm run analyze-ink` to find dead ends
3. Verify file paths in `stories.txt` match actual files
4. Check images are in correct `public/assets/{story-id}/` folder
5. Review existing stories in `public/stories/` for examples

---

**Ready to create? Just write `.ink` files and they work immediately!**
