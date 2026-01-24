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

id: another-story
title: Another Story
description: Another interesting topic to explore.
file: another_story.ink
```

### Format Rules
1. Each story needs 4 fields: `id`, `title`, `description`, and `file`
2. Use a blank line to separate stories
3. Lines starting with `#` are comments (ignored)
4. Field names must be lowercase
5. The `file` field should be just the filename (not a path)

### Adding a New Story
1. Create your `.ink` file in this folder
2. Add a new entry to `stories.txt`:
   ```
   id: my-new-topic
   title: My New Topic
   description: A fascinating discussion about something important.
   file: my_new_topic.ink
   ```
3. Save and refresh the app - it will appear automatically!

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

Images must be in the `public/assets/` folder.

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
# Start dev server (stories auto-reload on change)
npm run dev

# Analyze a story for dead ends
npm run analyze-ink public/stories/story_name.ink

# Build for production
npm run build
```

## File Organization

```
public/stories/
├── stories.txt              # Story list (edit this!)
├── demo.ink                 # Simple demo story
├── age_verification.ink     # Age verification story
└── README.md               # This file
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
