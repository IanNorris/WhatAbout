#!/usr/bin/env node

/**
 * Ink Story Compiler
 * 
 * Compiles .ink files to .json for use with inkjs.
 * Can run once or watch for changes.
 * 
 * Uses the inkjs compiler (cross-platform Node.js implementation).
 * 
 * Usage:
 *   node tools/compile-ink.js          # Compile all .ink files once
 *   node tools/compile-ink.js --watch  # Watch for changes and recompile
 */

import { Compiler } from 'inkjs/compiler/Compiler';
import { PosixFileHandler } from 'inkjs/compiler/FileHandler/PosixFileHandler';
import { watch } from 'fs';
import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STORIES_DIR = path.join(__dirname, '..', 'public', 'stories');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

/**
 * Compile a single .ink file to .json using inkjs compiler
 */
async function compileInkFile(inkPath) {
    const jsonPath = inkPath.replace(/\.ink$/, '.json');
    const fileName = path.basename(inkPath);
    const storyDir = path.dirname(inkPath);
    
    console.log(`${colors.cyan}Compiling${colors.reset} ${fileName}...`);
    
    try {
        // Read the ink source
        const inkSource = await readFile(inkPath, 'utf8');
        
        // Create file handler for INCLUDE resolution
        const fileHandler = new PosixFileHandler(storyDir);
        
        // Compile with inkjs
        const compiler = new Compiler(inkSource, {
            fileHandler: fileHandler,
            errorHandler: (message, errorType) => {
                if (errorType === 0) { // Warning
                    // Warnings are OK, just log them
                    if (!compiler.warnings) compiler.warnings = [];
                    compiler.warnings.push(message);
                } else { // Error
                    if (!compiler.errors) compiler.errors = [];
                    compiler.errors.push(message);
                }
            }
        });
        
        const story = compiler.Compile();
        
        // Check for actual errors (not warnings)
        if (compiler.errors && compiler.errors.length > 0) {
            const actualErrors = compiler.errors.filter(err => !err.startsWith('WARNING:'));
            if (actualErrors.length > 0) {
                console.error(`${colors.red}✗${colors.reset} Failed to compile ${fileName}`);
                actualErrors.forEach(err => console.error(`  ${err}`));
                throw new Error(`Compilation failed with ${actualErrors.length} error(s)`);
            }
        }
        
        // Write JSON output
        await writeFile(jsonPath, story.ToJson());
        
        console.log(`${colors.green}✓${colors.reset} ${fileName} → ${path.basename(jsonPath)}`);
        
        // Optionally log warnings (but don't fail)
        if (compiler.warnings && compiler.warnings.length > 0) {
            console.log(`  ${colors.yellow}${compiler.warnings.length} warning(s)${colors.reset}`);
        }
    } catch (err) {
        console.error(`${colors.red}✗${colors.reset} Failed to compile ${fileName}`);
        console.error(`Error: ${err.message}`);
        throw err;
    }
}

/**
 * Find all entry point .ink files (files in story folders, but skip component files)
 * Component files are identified by starting with ===
 */
async function findInkFiles() {
    const { readdir, readFile } = await import('fs/promises');
    const allFiles = [];
    
    async function scanDirectory(dir, depth = 0) {
        const entries = await readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory() && depth === 0) {
                // Scan story subdirectories
                await scanDirectory(fullPath, depth + 1);
            } else if (entry.isFile() && entry.name.endsWith('.ink') && depth === 1) {
                // Check if this is an entry point file (not a component)
                try {
                    const content = await readFile(fullPath, 'utf8');
                    const firstLine = content.trim().split('\n')[0].trim();
                    
                    // Skip files that start with === (component files meant to be INCLUDEd)
                    if (!firstLine.startsWith('===')) {
                        allFiles.push(fullPath);
                    }
                } catch (err) {
                    // If we can't read it, skip it
                    console.error(`Could not read ${fullPath}:`, err.message);
                }
            }
        }
    }
    
    await scanDirectory(STORIES_DIR);
    return allFiles;
}

/**
 * Compile all .ink files
 */
async function compileAll() {
    console.log(`${colors.cyan}Looking for .ink files in${colors.reset} ${STORIES_DIR}\n`);
    
    const inkFiles = await findInkFiles();
    
    if (inkFiles.length === 0) {
        console.log(`${colors.yellow}No .ink files found${colors.reset}`);
        return;
    }
    
    console.log(`Found ${inkFiles.length} .ink file(s)\n`);
    
    for (const inkFile of inkFiles) {
        try {
            await compileInkFile(inkFile);
        } catch (err) {
            console.error(`Error compiling ${path.basename(inkFile)}:`, err.message);
        }
    }
    
    console.log(`\n${colors.green}Compilation complete${colors.reset}`);
}

/**
 * Watch for changes and recompile
 */
async function watchMode() {
    console.log(`${colors.cyan}Watching for changes...${colors.reset}\n`);
    
    // Initial compilation
    await compileAll();
    
    // Watch the stories directory
    const watcher = watch(STORIES_DIR, async (eventType, filename) => {
        if (filename && filename.endsWith('.ink')) {
            console.log(`\n${colors.yellow}Detected change:${colors.reset} ${filename}`);
            const inkPath = path.join(STORIES_DIR, filename);
            
            try {
                await compileInkFile(inkPath);
            } catch (err) {
                console.error(`Error:`, err.message);
            }
        }
    });
    
    console.log(`\n${colors.green}Watching...${colors.reset} Press Ctrl+C to stop\n`);
    
    // Keep process alive
    process.on('SIGINT', () => {
        console.log(`\n${colors.cyan}Stopped watching${colors.reset}`);
        watcher.close();
        process.exit(0);
    });
}

// Main
const args = process.argv.slice(2);
const isWatchMode = args.includes('--watch') || args.includes('-w');

if (isWatchMode) {
    watchMode().catch(console.error);
} else {
    compileAll().catch(console.error);
}
