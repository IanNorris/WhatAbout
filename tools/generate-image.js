#!/usr/bin/env node

/**
 * OpenRouter Image Generation Tool
 * 
 * Generates images using OpenRouter's API with the Nano Banana Pro model.
 * 
 * Usage:
 *   node generate-image.js "your prompt here" ./output/directory
 *   node generate-image.js "your prompt here" ./output/image.png
 * 
 * Requirements:
 *   - OPENROUTER_API_KEY in .env file
 *   - dotenv package installed
 */

import dotenv from 'dotenv';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables from repo root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Model identifier for Nano Banana Pro (image generation)
const MODEL = 'google/gemini-3-pro-image-preview';

async function generateImage(prompt) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not found in .env file');
  }

  console.log('Generating image with prompt:', prompt);
  console.log('Using model:', MODEL);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/copilot-cli',
      'X-Title': 'WhatAbout Image Generator'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      modalities: ['image', 'text']
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  // Extract image URL from images array
  const message = data.choices?.[0]?.message;
  const imageUrl = message?.images?.[0]?.image_url?.url;
  
  if (!imageUrl) {
    throw new Error('No image URL in response. Response: ' + JSON.stringify(data, null, 2));
  }

  return imageUrl;
}

async function downloadImage(url) {
  console.log('Downloading image from:', url);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
}

async function saveImage(imageData, outputPath) {
  const ext = path.extname(outputPath);
  let finalPath = outputPath;

  // If no extension, treat as directory
  if (!ext) {
    const timestamp = Date.now();
    const filename = `image-${timestamp}.png`;
    finalPath = path.join(outputPath, filename);
    
    // Create directory if it doesn't exist
    if (!existsSync(outputPath)) {
      await mkdir(outputPath, { recursive: true });
    }
  } else {
    // Ensure parent directory exists
    const dir = path.dirname(finalPath);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
  }

  await writeFile(finalPath, imageData);
  return finalPath;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node generate-image.js "prompt" output-path');
    console.error('');
    console.error('Examples:');
    console.error('  node generate-image.js "a sunset" ./WhatAbout/src/assets');
    console.error('  node generate-image.js "a sunset" ./WhatAbout/src/assets/sunset.png');
    process.exit(1);
  }

  const [prompt, outputPath] = args;

  try {
    // Generate image
    const imageUrl = await generateImage(prompt);
    
    // Download image
    const imageData = await downloadImage(imageUrl);
    
    // Save to disk
    const savedPath = await saveImage(imageData, outputPath);
    
    console.log('✓ Image generated successfully!');
    console.log('Saved to:', path.resolve(savedPath));
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

main();
