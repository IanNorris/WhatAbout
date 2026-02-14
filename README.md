# What About

An interactive web app exploring digital rights topics — age verification, facial recognition, on-device scanning, and more — through conversational narratives powered by [Ink](https://github.com/inkle/ink).

Created by [Think Of The Kids](https://github.com/ThinkOfTheKids) — concerned citizens acting independently of any political party or interest group.

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
npm run test          # Run test suite
npm run analyze-ink   # Analyze story for dead ends
```

## 🧪 Testing

Comprehensive testing framework for story validation:

```bash
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:ui       # Run with visual UI
npm run test:e2e      # Run end-to-end tests
```

See `TESTING.md` for full testing documentation.

### Story Authoring

When writing Ink stories, avoid common pitfalls:

- ⚠️ Don't start lines with `**text:**` (Ink treats as choice)
- ✅ Use bullet points `•` or indent markdown formatting
- ✅ Add sticky exit choices (`+`) in exploration sections
- ✅ Run path discovery tests to find dead-ends

See `STORY_AUTHORING.md` for complete authoring guide.

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

### Exiting Back to Hub

Use the `exit()` function to provide a smooth return to the hub:

```ink
EXTERNAL exit()

* [I'm finished]
    Thanks for learning with us! Feel free to explore other topics.
    ~ exit()
    -> END
```

The user will see the farewell message for 3 seconds before returning to the hub.

### Cross-Linking Stories

Link from one story to another using `navigateTo()`:

```ink
EXTERNAL navigateTo(story_id)

* [Learn about related topic]
    Let's explore that...
    ~ navigateTo("related-story-id")
    -> END
```

Users can return to the parent story via the menu's "Exit to [Parent]" option.

---

## 📚 Documentation

### Getting Started
- **[USER_GUIDE.md](USER_GUIDE.md)** - Complete user onboarding guide
- **[AGENT_REFERENCE.md](AGENT_REFERENCE.md)** - Quick reference for AI assistants and developers

### Detailed Documentation
- **[STORY_AUTHORING.md](STORY_AUTHORING.md)** - Story writing guide and common pitfalls
- **[TESTING.md](TESTING.md)** - Testing framework and validation
- **[BUILD_REQUIREMENTS.md](BUILD_REQUIREMENTS.md)** - Build process and requirements
- **[tools/IMAGE_STYLE_GUIDE.md](tools/IMAGE_STYLE_GUIDE.md)** - Visual style guide for images
- **[public/stories/README.md](public/stories/README.md)** - Complete Ink syntax reference
- **[.github/WORKFLOWS.md](.github/WORKFLOWS.md)** - CI/CD documentation
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - GitHub Copilot context

---

Built with React + Vite
