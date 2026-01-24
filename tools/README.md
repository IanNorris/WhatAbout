# Image Generation Tool

Generate images using OpenRouter's Nano Banana Pro model.

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your OpenRouter API key to `.env`:
   ```
   OPENROUTER_API_KEY=your_actual_key_here
   ```

3. Get your API key from: https://openrouter.ai/keys

## Usage

```bash
# From repo root
node tools/generate-image.js "your prompt here" ./public/assets

# Generate image with specific filename
node tools/generate-image.js "your prompt here" ./public/assets/image.png
```

## Examples

```bash
# Generate a sunset image to public assets
node tools/generate-image.js "ethereal sunset over misty mountains" ./public/assets

# Generate with specific filename
node tools/generate-image.js "abstract thought cloud" ./public/assets/cloud.png
```

## Notes

- Images are saved to the path you specify (use `public/assets` for Vite static assets)
- If you provide a directory, a timestamped filename is generated
- If you provide a full path with extension, that exact filename is used
- The `.env` file is gitignored - never commit your API key!
- Files in `public/` are served as-is by Vite at the root URL
