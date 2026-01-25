# What About

An interactive web app that explores complex topics through conversational narratives powered by [Ink](https://github.com/inkle/ink).

## ✨ Key Features

- **No Build Required for Content**: Add new .ink story files and they work immediately - no compilation needed!
- **Runtime Compilation**: Stories are compiled in the browser using inkjs, including full INCLUDE support
- **Non-Technical Friendly**: Content creators can add stories without understanding npm or build processes
- **Optional Pre-compilation**: For production performance, optionally pre-compile stories to JSON

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:5173 and start exploring!

## 📝 Adding a New Story

1. Create a folder in `public/stories/` with your story ID (e.g., `my-topic`)
2. Create your `.ink` file(s) in that folder
3. Add images to `public/assets/my-topic/`
4. Add an entry to `public/stories/stories.txt`:
   ```
   id: my-topic
   title: My Topic
   description: An interesting discussion
   file: main.ink
   release: true
   ```
5. Refresh the browser - your story is live!

See `public/stories/README.md` for detailed documentation.

## 🔧 Development Commands

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run lint          # Run linter
npm run analyze-ink   # Analyze story for dead ends
```

### Optional Performance Optimization

For faster load times, you can optionally pre-compile stories:

```bash
npm run compile-ink          # Compile once
npm run compile-ink:watch    # Auto-compile on changes
```

Pre-compiled JSON files are optional - the app works without them!

## 🛠 Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **inkjs** - Ink story runtime and compiler
- **CSS Modules** - Scoped styling

## 🐛 Error Handling

The app provides helpful error messages when things go wrong:

### Missing Include Files
If an INCLUDE file is missing, you'll see:
```
Could not find file: section1.ink

Make sure the file exists in the same folder as your main story file.
Path attempted: /stories/my-story/section1.ink
```

### Compilation Errors
If your Ink syntax has errors, you'll see:
```
Story has compilation errors:

  1. ERROR: line 15: Expected choice text after '* ['
  2. ERROR: line 23: Unrecognized statement

Please fix these issues in your .ink file.
```

### File Not Found
If the main story file is missing:
```
Could not load story file: /stories/my-story/main.ink

Please make sure the file exists and the path is correct.
```

All errors are shown in the UI with clear formatting, making it easy for content creators to fix issues without checking the browser console.

## 📚 Story Format

Stories use [Ink](https://github.com/inkle/ink) scripting language:

```ink
This is narrative text.

* [First choice]
    Response to first choice.
* [Second choice]
    Response to second choice.
```

### Images

Add images using tags:

```ink
This paragraph has a diagram. # diagram: my_image.png
```

Images load from `public/assets/{story-id}/`

### Multi-File Stories

Use INCLUDE to split large stories:

**main.ink:**
```ink
INCLUDE section1.ink
INCLUDE section2.ink
```

Runtime compilation automatically resolves all includes!

---

Built with React + Vite
