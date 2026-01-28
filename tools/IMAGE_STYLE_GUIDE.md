# Image Style Guide for What About

## Image Dimensions

**Standard size: 618 × 337 pixels**

All images should be resized to this exact dimension for consistency across the app. This matches the rendered size in the interface.

### Optimizing Images

Use the provided optimization script to batch-process images. The script:
- Resizes to 618×337px
- Generates both PNG and JPEG (85% quality) versions
- Keeps whichever format is smaller
- Automatically updates .ink file references

```bash
# Optimize all images in public/assets/
node tools/resize-images.js

# Optimize images in a specific folder
node tools/resize-images.js age-verification

# Preview changes without modifying files
node tools/resize-images.js --dry-run
```

The script uses high-quality resizing with a dark background fill to match the app theme.

## Core Principles
- **Clear visual metaphors** that people immediately understand
- **Diagram-style** illustrations where possible
- **Friendly but professional** tone (not sterile, not overly whimsical)
- **Concise and readable** - viewers should "get it" in 2-3 seconds
- **Consistent visual language** across all images
- **Dark background** to match app's dark theme

## Visual Style
- **Background**: Dark blue-black (#0f1419 to #1a2332)
- Soft, muted colors for elements (blues, purples, teals, warm accents)
- Clean lines with subtle texture
- Isometric or flat design perspective
- Minimal but not empty - include enough detail to convey meaning
- Gentle glows and highlights for visibility on dark background

## Technical Approach
- Use familiar objects as metaphors (pipes, shields, locks, paths)
- Include recognizable symbols (1s and 0s for data, padlocks for security)
- Avoid pure abstraction - always ground metaphors in concrete visuals
- Show relationships through connecting lines or spatial arrangement
- Use color to indicate good/bad, safe/unsafe, before/after
- **Be specific about text**: Tell the AI exactly what labels/words to include

## Prompt Template

```
[Core concept/metaphor], clean diagram style illustration, [specific visual elements with exact text labels], 
dark background (#0f1419), friendly professional design, glowing soft [colors], 
minimal composition, subtle texture, easy to understand at a glance
```

## Prompt Guide - Lessons Learned

### Be Extremely Specific
❌ BAD: "protective barriers with some text"
✅ GOOD: "three labeled shields with text: 'Content Filter', 'Time Limits', 'Safe Search'"

### Always Specify Dark Background
❌ BAD: "minimal background"
✅ GOOD: "dark blue-black background (#0f1419)"

### Define Exact Visual Elements
❌ BAD: "show data flowing"
✅ GOOD: "translucent pipes with streams of 1s and 0s flowing as glowing blue particles"

### Specify Quantity and Arrangement
❌ BAD: "multiple shields"
✅ GOOD: "three overlapping protective shields arranged in a semi-circle"

### Include Negative Instructions When Needed
✅ GOOD: "clean simple icons, avoid photorealistic style, no bullet points, no repeated elements"

## Examples

### Good Metaphors with Specific Instructions

**VPNs as Pipes:**
"nested translucent pipes with inner pipe containing visible data stream of glowing 1s and 0s, outer pipe labeled 'VPN Tunnel', dark background, clean diagram style"

**Privacy Shields:**
"three overlapping shields labeled 'Encryption', 'Privacy', 'Anonymity', glowing blue outlines on dark background, clean diagram style"

**Data Collection:**
"central filing cabinet with glowing copies radiating outward to smaller filing cabinets labeled with website names, connecting lines showing data duplication, dark blue-black background"

**Parental Controls:**
"protective dome over a simple computer icon, surrounding filters labeled 'Content', 'Time', 'Apps', glowing teal protective barriers on dark background"

### What to Avoid
- Pure abstract shapes without clear meaning
- Light backgrounds (must be dark)
- Overly complex compositions
- Too dark/ominous (unless intentional for honeypot database)
- Sterile corporate stock photo look
- Childish cartoon style
- Bullet points or list formatting
- Repeated/duplicate elements

## Color Palette (on Dark Background)
- Primary: Soft glowing blues (#7ba3ff, #6b8cce)
- Secondary: Purple tones (#9b87c7, #c6b4db) 
- Accents: Warm orange/amber for warnings (#f4a261)
- Highlights: Light gray for text (#e8eaed)
- Success/Safety: Soft teal glow (#4ecdc4)
- Background: Always dark blue-black (#0f1419, #1a2332)

## Current Prompt Format

```
[specific metaphor with exact quantities], clean diagram style illustration, 
dark blue-black background (#0f1419), [exact labels/text needed], 
[specific elements like "translucent pipes with 1s and 0s", "three shields labeled X Y Z"], 
friendly professional design, glowing soft [specific colors], 
minimal composition with subtle texture, easy to understand visual metaphor,
avoid [specific things to avoid like "bullet points", "repeated elements"]
```

## Testing Process
1. Generate image with specific prompt
2. Check for: correct background color, clear metaphor, right number of elements, specified text labels
3. If issues: add more specific instructions or negative prompts
4. Regenerate until it matches requirements

