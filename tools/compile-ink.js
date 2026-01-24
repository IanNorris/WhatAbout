#!/usr/bin/env node

/**
 * Ink Story Compiler
 * 
 * Compiles .ink files to .json for use with inkjs.
 * Can run once or watch for changes.
 * 
 * Usage:
 *   node tools/compile-ink.js          # Compile all .ink files once
 *   node tools/compile-ink.js --watch  # Watch for changes and recompile
 */

import { spawn } from 'child_process';
import { watch } from 'fs';
import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to inklecate compiler (using inkjs-compatible version)
const INKLECATE_PATH = path.join(__dirname, '..', '..', 'Inky', 'resources', 'app.asar.unpacked', 'main-process', 'ink', 'inkjs-compatible', 'inklecate_win.exe');
const STORIES_DIR = path.join(__dirname, '..', 'src', 'stories');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

/**
 * Compile a single .ink file to .json
 */
async function compileInkFile(inkPath) {
    const jsonPath = inkPath.replace(/\.ink$/, '.json');
    const fileName = path.basename(inkPath);
    
    console.log(`${colors.cyan}Compiling${colors.reset} ${fileName}...`);
    
    return new Promise((resolve, reject) => {
        const process = spawn(INKLECATE_PATH, ['-o', jsonPath, inkPath]);
        
        let stdout = '';
        let stderr = '';
        
        process.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        
        process.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        process.on('close', (code) => {
            if (code === 0) {
                console.log(`${colors.green}✓${colors.reset} ${fileName} → ${path.basename(jsonPath)}`);
                resolve();
            } else {
                console.error(`${colors.red}✗${colors.reset} Failed to compile ${fileName}`);
                if (stderr) console.error(stderr);
                reject(new Error(`Compilation failed with code ${code}`));
            }
        });
    });
}

/**
 * Find all .ink files in the stories directory
 */
async function findInkFiles() {
    const files = await readdir(STORIES_DIR);
    return files
        .filter(f => f.endsWith('.ink'))
        .map(f => path.join(STORIES_DIR, f));
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
