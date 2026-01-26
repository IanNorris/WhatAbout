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
5. Save and refresh the app - it will load and compile automatically!

**That's it!** No build step, no npm commands. Just create your .ink files and they work.

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
- Exit to hub via `exit()` function

### Exiting to Hub

To provide a clean exit experience back to the hub, use the `exit()` external function:

```ink
EXTERNAL exit()

VAR topic_title = "My Story"

Story content here...

* [I'm done learning about this]
    Thanks for exploring! Come back anytime to learn more.
    ~ exit()
    -> END
```

**Important notes:**
- Declare `EXTERNAL exit()` at the top of your main story file
- Show a farewell message before calling `exit()`
- Always include `-> END` after `exit()` (Ink requires a valid endpoint)
- The exit triggers after a 3-second delay for reading the message
- The reader is automatically returned to the hub

**Bad example (don't do this):**
```ink
* [I'm done] -> END  // ❌ Abrupt, no farewell message
```

**Good example:**
```ink
* [I'm done]
    Thanks for reading! Head back to explore other topics.
    ~ exit()
    -> END  // ✅ Provides context and smooth transition
```

### Cross-Linking to Other Stories

To link from one story to another, use the `navigateTo()` external function:

```ink
EXTERNAL navigateTo(story_id)

VAR topic_title = "My Story"

Story content here...

Want to learn more about privacy?
* [Explore Privacy Topic]
    Let's dive deeper into that...
    ~ navigateTo("privacy-basics")
    -> END
```

**How it works:**
- The user is pushed into the new story (added to navigation stack)
- When they exit the sub-story via the menu, they return to where they left off
- The menu shows "Exit to [Parent Story]" when in a sub-story
- Story IDs must match the `id` field in `stories.txt`

**Important notes:**
- Declare `EXTERNAL navigateTo(story_id)` at the top of your main story file
- The story ID parameter must exist in `stories.txt`
- Always include `-> END` after navigation
- The navigation happens immediately (no delay like `exit()`)
- The parent story's progress is preserved when returning

**Best Practice: Always provide an "exit ramp"**

To avoid jarring topic switches, give users a preview and explicit choice before navigating:

❌ **Bad example (jarring, immediate switch):**
```ink
* [What about VPNs?]
    ~ navigateTo("vpn-bans")  // Immediately switches topic
    -> END
```

✅ **Good example (preview with choice):**
```ink
* [What about VPNs?]
    That's a whole separate topic worth exploring.
    -> VPN_Preview

=== VPN_Preview ===
Banning VPNs seems obvious, but it opens up questions about surveillance, legitimate uses, and technical feasibility.

* [Take me through why VPN bans don't work]
    ~ navigateTo("vpn-bans")  // User explicitly chose to switch
    -> END
* [I'll take your word for it. Continue here.]
    -> current_topic_continues
```

The exit ramp pattern:
1. Acknowledges the user's interest
2. Previews what the new topic covers
3. Gives explicit choice to explore or stay
4. Prevents surprise redirects

**Example use case:**
```ink
EXTERNAL navigateTo(story_id)

This concept relates to encryption...

* [Learn about encryption first]
    Great idea! Let's explore that foundation.
    ~ navigateTo("encryption-basics")
    -> END
    
* [Continue without background]
    Okay, proceeding with the assumption you know encryption...
    -> advanced_content
```


## Development Commands

```bash
# Start dev server
npm run dev          # Stories are compiled at runtime automatically

# Analyze a story for dead ends
npm run analyze-ink public/stories/age_verification/main.ink

# Build for production
npm run build
```

**Note:** Stories are compiled at runtime from .ink source files. No build step required!
The app automatically loads and compiles .ink files, resolving all INCLUDE statements.

### Optional: Pre-compilation for Performance

For better load times in production, you can optionally pre-compile stories:

```bash
# Compile .ink files to .json once
npm run compile-ink

# Watch and auto-compile on changes
npm run compile-ink:watch
```

Pre-compiled .json files are gitignored. If present, they'll be used instead of runtime compilation.

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
        ├── happy_Internet.png
        ├── vpn_bypass.png
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
