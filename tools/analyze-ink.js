#!/usr/bin/env node

/**
 * Ink Story Dead End Analyzer
 * 
 * Analyzes compiled Ink stories to find dead ends - paths that end without:
 * - Explicit END statement
 * - Choices for the reader
 * - Divert to another knot/stitch
 * 
 * Usage:
 *   node tools/analyze-ink.js public/stories/age_verification.ink
 *   node tools/analyze-ink.js public/stories/*.ink
 */

import { spawn } from 'child_process';
import { readFile, mkdtemp, rm } from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INKLECATE_PATH = path.join(__dirname, '..', '..', 'Inky', 'resources', 'app.asar.unpacked', 'main-process', 'ink', 'inkjs-compatible', 'inklecate_win.exe');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

/**
 * Compile an .ink file to JSON
 */
async function compileInk(inkPath) {
    const tmpDir = await mkdtemp(path.join(tmpdir(), 'ink-analyze-'));
    const jsonPath = path.join(tmpDir, 'story.json');
    
    return new Promise((resolve, reject) => {
        const process = spawn(INKLECATE_PATH, ['-o', jsonPath, inkPath]);
        
        let stderr = '';
        
        process.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        process.on('close', async (code) => {
            if (code === 0) {
                try {
                    const json = await readFile(jsonPath, 'utf8');
                    await rm(tmpDir, { recursive: true });
                    resolve(JSON.parse(json));
                } catch (err) {
                    reject(err);
                }
            } else {
                await rm(tmpDir, { recursive: true }).catch(() => {});
                reject(new Error(`Compilation failed: ${stderr}`));
            }
        });
    });
}

/**
 * Analyze compiled Ink JSON for dead ends
 */
function analyzeStory(storyJson) {
    const deadEnds = [];
    const root = storyJson.root;
    
    if (!root) {
        throw new Error('Invalid story JSON structure');
    }
    
    // Recursively analyze content
    function analyzeContent(content, pathName) {
        if (!Array.isArray(content)) {
            return;
        }
        
        let hasChoices = false;
        let hasEnd = false;
        let hasDivert = false;
        let hasText = false;
        
        for (let i = 0; i < content.length; i++) {
            const item = content[i];
            
            if (typeof item === 'string' && item.trim().length > 0) {
                hasText = true;
            } else if (typeof item === 'object' && item !== null) {
                // Check for choices (marked with * or +)
                if (item['*'] !== undefined || item['+'] !== undefined) {
                    hasChoices = true;
                }
                // Check for END marker
                if (item['#n'] === 'END' || item.end !== undefined) {
                    hasEnd = true;
                }
                // Check for divert
                if (item['->'] !== undefined || item.divert !== undefined) {
                    hasDivert = true;
                }
            }
        }
        
        // A dead end is text without forward progress
        if (hasText && !hasChoices && !hasEnd && !hasDivert) {
            deadEnds.push({
                path: pathName,
                reason: 'Content ends without choices, END, or divert'
            });
        }
    }
    
    // Walk all knots
    function walkKnots(obj, prefix = '') {
        for (const [key, value] of Object.entries(obj)) {
            // Skip special Ink keys
            if (key.startsWith('global decl') || key === 'listDefs') {
                continue;
            }
            
            const fullPath = prefix ? `${prefix}.${key}` : key;
            
            if (Array.isArray(value)) {
                // This is content - analyze it
                analyzeContent(value, fullPath);
            } else if (typeof value === 'object' && value !== null) {
                // Nested knot/stitch - recurse
                walkKnots(value, fullPath);
            }
        }
    }
    
    walkKnots(root);
    
    return deadEnds;
}

/**
 * Print analysis results
 */
function printResults(inkPath, deadEnds) {
    const filename = path.basename(inkPath);
    
    console.log(`\n${colors.bold}${colors.cyan}Analyzing:${colors.reset} ${filename}`);
    console.log('─'.repeat(60));
    
    if (deadEnds.length === 0) {
        console.log(`${colors.green}✓ No dead ends found${colors.reset}`);
    } else {
        console.log(`${colors.yellow}⚠ Found ${deadEnds.length} potential dead end(s):${colors.reset}\n`);
        
        for (const deadEnd of deadEnds) {
            console.log(`  ${colors.red}✗${colors.reset} ${colors.bold}${deadEnd.path}${colors.reset}`);
            console.log(`    Reason: ${deadEnd.reason}`);
        }
    }
    
    console.log();
}

/**
 * Main
 */
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error(`${colors.red}Error: No .ink file specified${colors.reset}`);
        console.log(`Usage: node tools/analyze-ink.js <path-to-ink-file>`);
        console.log(`Example: node tools/analyze-ink.js public/stories/age_verification.ink`);
        process.exit(1);
    }
    
    const inkPath = args[0];
    
    try {
        console.log(`${colors.cyan}Compiling...${colors.reset}`);
        const storyJson = await compileInk(inkPath);
        
        console.log(`${colors.cyan}Analyzing...${colors.reset}`);
        const deadEnds = analyzeStory(storyJson);
        
        printResults(inkPath, deadEnds);
        
        process.exit(deadEnds.length > 0 ? 1 : 0);
    } catch (error) {
        console.error(`${colors.red}Error:${colors.reset}`, error.message);
        process.exit(1);
    }
}

main();
