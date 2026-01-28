#!/usr/bin/env node

/**
 * Image Optimizer for What About Project
 * 
 * Resizes images to 618x337px and optimizes file size by:
 * 1. Generating both PNG and JPEG (85% quality) versions
 * 2. Keeping whichever format is smaller
 * 3. Updating .ink file references to match the chosen format
 * 
 * Usage:
 *   node tools/resize-images.js                    # Optimize all images
 *   node tools/resize-images.js age-verification   # Optimize specific folder
 *   node tools/resize-images.js --dry-run          # Preview without changes
 */

import sharp from 'sharp';
import { readdir, stat, unlink, readFile, writeFile } from 'fs/promises';
import { join, relative, parse, dirname as pathDirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Standard dimensions based on rendered size
const TARGET_WIDTH = 618;
const TARGET_HEIGHT = 337;
const JPEG_QUALITY = 85;

const projectRoot = join(__dirname, '..');
const assetsPath = join(projectRoot, 'public', 'assets');
const storiesPath = join(projectRoot, 'public', 'stories');

async function getAllImages(dir, folderFilter = null) {
    const images = [];
    
    async function traverse(currentPath) {
        const entries = await readdir(currentPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = join(currentPath, entry.name);
            
            if (entry.isDirectory()) {
                // If folder filter specified, only process that folder
                if (folderFilter && entry.name !== folderFilter) {
                    continue;
                }
                await traverse(fullPath);
            } else if (entry.isFile() && /\.(png|jpg|jpeg|webp)$/i.test(entry.name)) {
                images.push(fullPath);
            }
        }
    }
    
    await traverse(dir);
    return images;
}

async function getImageDimensions(imagePath) {
    const metadata = await sharp(imagePath).metadata();
    return { width: metadata.width, height: metadata.height };
}

async function getFileSize(filePath) {
    try {
        const stats = await stat(filePath);
        return stats.size;
    } catch {
        return 0;
    }
}

async function updateInkReferences(oldPath, newPath) {
    const oldBasename = basename(oldPath);
    const newBasename = basename(newPath);
    
    if (oldBasename === newBasename) {
        return []; // No change needed
    }
    
    const updatedFiles = [];
    
    async function processInkFiles(dir) {
        const entries = await readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = join(dir, entry.name);
            
            if (entry.isDirectory()) {
                await processInkFiles(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.ink')) {
                const content = await readFile(fullPath, 'utf-8');
                const newContent = content.replace(
                    new RegExp(oldBasename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                    newBasename
                );
                
                if (content !== newContent) {
                    await writeFile(fullPath, newContent, 'utf-8');
                    updatedFiles.push(relative(projectRoot, fullPath));
                }
            }
        }
    }
    
    await processInkFiles(storiesPath);
    return updatedFiles;
}

async function optimizeImage(imagePath, dryRun = false) {
    const { width, height } = await getImageDimensions(imagePath);
    const relativePath = relative(projectRoot, imagePath);
    const parsed = parse(imagePath);
    const baseNameWithoutExt = parsed.name;
    const currentExt = parsed.ext.toLowerCase();
    
    // Check if resize needed
    if (width === TARGET_WIDTH && height === TARGET_HEIGHT) {
        console.log(`✓ ${relativePath} (already ${TARGET_WIDTH}x${TARGET_HEIGHT})`);
        return { skipped: true };
    }
    
    if (dryRun) {
        console.log(`• ${relativePath} (${width}x${height} → ${TARGET_WIDTH}x${TARGET_HEIGHT}, will compare PNG vs JPEG)`);
        return { wouldOptimize: true };
    }
    
    // Paths for both formats
    const pngPath = join(parsed.dir, `${baseNameWithoutExt}.png`);
    const jpegPath = join(parsed.dir, `${baseNameWithoutExt}.jpg`);
    const tempPngPath = pngPath + '.tmp';
    const tempJpegPath = jpegPath + '.tmp';
    
    // Generate resized image buffer
    const resizedBuffer = await sharp(imagePath)
        .resize(TARGET_WIDTH, TARGET_HEIGHT, {
            fit: 'contain',
            background: { r: 15, g: 20, b: 25, alpha: 1 }
        })
        .toBuffer();
    
    // Save both PNG and JPEG versions
    await sharp(resizedBuffer).png().toFile(tempPngPath);
    await sharp(resizedBuffer).jpeg({ quality: JPEG_QUALITY }).toFile(tempJpegPath);
    
    // Compare file sizes
    const pngSize = await getFileSize(tempPngPath);
    const jpegSize = await getFileSize(tempJpegPath);
    
    const usePng = pngSize <= jpegSize;
    const chosenPath = usePng ? pngPath : jpegPath;
    const chosenExt = usePng ? '.png' : '.jpg';
    const discardedPath = usePng ? jpegPath : pngPath;
    const chosenTempPath = usePng ? tempPngPath : tempJpegPath;
    const discardedTempPath = usePng ? tempJpegPath : tempPngPath;
    
    // Delete the original if it's a different format
    if (imagePath !== chosenPath) {
        await unlink(imagePath);
    }
    
    // Move chosen temp file to final location
    await unlink(discardedTempPath);
    if (chosenPath === imagePath) {
        // Same file, just replace
        await unlink(chosenPath);
        await sharp(chosenTempPath).toFile(chosenPath);
        await unlink(chosenTempPath);
    } else {
        // Different format, rename temp to final
        const { rename } = await import('fs/promises');
        await rename(chosenTempPath, chosenPath);
        
        // Delete discarded format if it exists
        try {
            await unlink(discardedPath);
        } catch {}
    }
    
    // Update .ink references if format changed
    let updatedFiles = [];
    if (currentExt !== chosenExt) {
        updatedFiles = await updateInkReferences(imagePath, chosenPath);
    }
    
    const formatInfo = usePng 
        ? `PNG (${(pngSize/1024).toFixed(1)}KB < ${(jpegSize/1024).toFixed(1)}KB JPEG)`
        : `JPEG (${(jpegSize/1024).toFixed(1)}KB < ${(pngSize/1024).toFixed(1)}KB PNG)`;
    
    console.log(`✓ ${relativePath} (${width}x${height} → ${TARGET_WIDTH}x${TARGET_HEIGHT}, ${formatInfo})`);
    if (updatedFiles.length > 0) {
        console.log(`  Updated ${updatedFiles.length} .ink file(s): ${updatedFiles.join(', ')}`);
    }
    
    return { optimized: true, formatChanged: currentExt !== chosenExt, inkFilesUpdated: updatedFiles.length };
}

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const folderFilter = args.find(arg => !arg.startsWith('--'));
    
    console.log('🖼️  Image Optimizer for What About\n');
    console.log(`Target size: ${TARGET_WIDTH}x${TARGET_HEIGHT}px`);
    console.log(`Strategy: Generate PNG & JPEG (${JPEG_QUALITY}% quality), keep smaller`);
    if (dryRun) {
        console.log('Mode: DRY RUN (no changes will be made)\n');
    }
    if (folderFilter) {
        console.log(`Folder filter: ${folderFilter}\n`);
    }
    console.log('');
    
    const images = await getAllImages(assetsPath, folderFilter);
    
    if (images.length === 0) {
        console.log('No images found.');
        return;
    }
    
    console.log(`Found ${images.length} images\n`);
    
    let stats = { 
        optimized: 0, 
        skipped: 0, 
        wouldOptimize: 0,
        formatChanged: 0,
        totalInkFilesUpdated: 0
    };
    
    for (const imagePath of images) {
        try {
            const result = await optimizeImage(imagePath, dryRun);
            if (result.optimized) stats.optimized++;
            if (result.skipped) stats.skipped++;
            if (result.wouldOptimize) stats.wouldOptimize++;
            if (result.formatChanged) stats.formatChanged++;
            if (result.inkFilesUpdated) stats.totalInkFilesUpdated += result.inkFilesUpdated;
        } catch (error) {
            console.error(`✗ ${relative(projectRoot, imagePath)} - ${error.message}`);
        }
    }
    
    console.log('\n' + '='.repeat(60));
    if (dryRun) {
        console.log(`Would optimize: ${stats.wouldOptimize}`);
        console.log(`Already correct size: ${stats.skipped}`);
    } else {
        console.log(`Optimized: ${stats.optimized}`);
        console.log(`Format changes: ${stats.formatChanged}`);
        console.log(`.ink files updated: ${stats.totalInkFilesUpdated}`);
        console.log(`Skipped (already correct): ${stats.skipped}`);
    }
    console.log('='.repeat(60));
}

main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
});
