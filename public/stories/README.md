# Stories Folder

This folder contains all the story content for the What About app.

## Files

- **stories.txt** - List of all stories that appear in the hub
- **\*.ink** - Ink story source files

## Editing the Story List

The `stories.txt` file controls which stories appear in the hub menu. It uses a simple human-readable format:

```
id: unique-story-id
title: Display Title
description: Brief description shown on the button
file: story_filename.ink
release: true

id: another-story
title: Another Story
description: Another interesting topic to explore.
file: another_story.ink
release: false
```

### Format Rules
1. Each story needs 5 fields: `id`, `title`, `description`, `file`, and `release`
2. Use a blank line to separate stories
3. Lines starting with `#` are comments (ignored)
4. Field names must be lowercase
5. The `file` field is relative to `stories/{id}/` folder (e.g., `main.ink` or `story.ink`)
6. The `release` field controls production visibility:
   - `release: true` - Story appears in both dev and production
   - `release: false` - Story only appears in dev (hidden in production builds)

### Adding a New Story
1. Create your story folder: `public/stories/my-story-id/`
2. Create your `.ink` file in that folder: `my-story-id/main.ink` (or any name)
3. Create a folder for your story's images: `public/assets/my-story-id/`
4. Add a new entry to `stories.txt`:
   ```
   id: my-story-id
   title: My Story Title
   description: A fascinating discussion about something important.
   file: main.ink
   release: true
   ```
5. Save and refresh the app - it will appear automatically!

### Tips
- Keep IDs short and URL-friendly (lowercase, hyphens instead of spaces)
- Keep descriptions under 100 characters for best display
- Test your story with the analyze tool: `npm run analyze-ink public/stories/your_story.ink`

## Ink Story Format

Stories are written in [Ink](https://github.com/inkle/ink), a scripting language for interactive narratives.

### Basic Ink Syntax
```ink
This is regular text that appears on screen.

* [First choice] 
    This text appears if they pick the first choice.
* [Second choice]
    This text appears if they pick the second choice.
```

### Adding Images
```ink
This paragraph has an image. # diagram: image_filename.png
```

Images are automatically loaded from `public/assets/{story-id}/` folder.

**Example:**
- Story ID: `my-story`
- Image reference in .ink: `# diagram: my_image.png`
- Actual path: `public/assets/my-story/my_image.png`

No need to include the story ID in the diagram tag - it's added automatically!

### Organizing Large Stories

For large stories, split them into multiple files using INCLUDE:

**main.ink:**
```ink
VAR topic_title = "My Topic"

Introduction text here...

INCLUDE section1.ink
INCLUDE section2.ink
```

**section1.ink:**
```ink
=== first_section ===
Content for the first section...
```

### Dead End Detection

Run the analyzer to find missing content:
```bash
npm run analyze-ink public/stories/your_story.ink
```

This will report any paths that end without:
- Explicit END statement
- Choices for the reader  
- Divert to another section (->)

## Development Commands

```bash
# Start dev server (manually compile .ink first)
npm run compile-ink  # Compile .ink files to .json
npm run dev          # Start dev server

# Or use the combined command:
npm run dev:full     # Auto-compile .ink on changes + start dev server

# Analyze a story for dead ends
npm run analyze-ink public/stories/age_verification/main.ink

# Build for production (compiles .ink automatically)
npm run build
```

**Note:** Compiled .json files are gitignored - they're generated from .ink source files.

## File Organization

```
public/
├── stories/
│   ├── stories.txt              # Story list (edit this!)
│   ├── README.md               # This file
│   ├── demo.ink                 # Demo story (release: false)
│   └── age_verification.ink     # Age verification story (release: true)
└── assets/
    ├── demo/                    # Demo story images
    │   └── demo_mascot.png
    └── age-verification/        # Age verification images
        ├── happy_Internet_v2.png
        ├── vpn_bypass_v2.png
        └── ...
```

When splitting large stories:
```
public/stories/
├── stories.txt
├── age_verification/
│   ├── main.ink            # Entry point with INCLUDEs
│   ├── vpn.ink             # VPN section
│   ├── ai_privacy.ink      # AI/Privacy sections
│   └── ...
```
