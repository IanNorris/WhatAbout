/**
 * Test All Stories for Dead Ends
 * 
 * Runs the dead end analyzer on all released stories and reports results.
 * Exit code 0 = all stories pass, 1 = dead ends found
 * 
 * Usage: npm run test-stories
 */

import { spawn } from 'child_process';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Valid exit patterns that should NOT be flagged as dead ends
// The analyze-ink script already handles exit() and navigateTo()
// This list is for documentation and can be extended

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

async function getStories() {
    const storiesPath = path.join(__dirname, '..', 'public', 'stories', 'stories.txt');
    const content = await readFile(storiesPath, 'utf-8');
    
    const stories = [];
    let currentStory = {};
    
    for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith('#') || trimmed === '') {
            if (currentStory.id) {
                stories.push(currentStory);
                currentStory = {};
            }
            continue;
        }
        
        const match = trimmed.match(/^(\w+):\s*(.+)$/);
        if (match) {
            currentStory[match[1]] = match[2];
        }
    }
    
    if (currentStory.id) {
        stories.push(currentStory);
    }
    
    // Only include released stories
    return stories.filter(s => s.release === 'true');
}

async function analyzeStory(storyId, storyFile) {
    const inkPath = path.join(__dirname, '..', 'public', 'stories', storyId, storyFile);
    
    return new Promise((resolve) => {
        const analyzer = spawn('node', [
            path.join(__dirname, 'analyze-ink.js'),
            inkPath
        ], { shell: true });
        
        let output = '';
        let errors = '';
        
        analyzer.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        analyzer.stderr.on('data', (data) => {
            errors += data.toString();
        });
        
        analyzer.on('close', (code) => {
            // Parse dead ends from output
            const deadEndMatch = output.match(/Found (\d+) potential dead end/);
            const deadEndCount = deadEndMatch ? parseInt(deadEndMatch[1]) : 0;
            
            // Extract individual dead ends
            const deadEnds = [];
            const deadEndPattern = /✗\s+(.+)\n\s+Reason:\s+(.+)/g;
            let match;
            while ((match = deadEndPattern.exec(output)) !== null) {
                deadEnds.push({ path: match[1], reason: match[2] });
            }
            
            resolve({
                storyId,
                passed: code === 0,
                deadEndCount,
                deadEnds,
                errors: errors.trim()
            });
        });
    });
}

async function main() {
    console.log(`${colors.cyan}${colors.bold}Testing All Stories for Dead Ends${colors.reset}\n`);
    
    const stories = await getStories();
    console.log(`Found ${stories.length} released stories\n`);
    
    const results = [];
    let totalDeadEnds = 0;
    
    for (const story of stories) {
        process.stdout.write(`  Analyzing ${story.id}... `);
        const result = await analyzeStory(story.id, story.file);
        results.push(result);
        
        if (result.passed) {
            console.log(`${colors.green}✓ Pass${colors.reset}`);
        } else {
            console.log(`${colors.red}✗ ${result.deadEndCount} dead end(s)${colors.reset}`);
            totalDeadEnds += result.deadEndCount;
        }
    }
    
    console.log('\n' + '═'.repeat(60));
    
    if (totalDeadEnds === 0) {
        console.log(`${colors.green}${colors.bold}All stories pass!${colors.reset}`);
        process.exit(0);
    } else {
        console.log(`${colors.red}${colors.bold}Found ${totalDeadEnds} dead end(s) across stories:${colors.reset}\n`);
        
        for (const result of results) {
            if (!result.passed) {
                console.log(`  ${colors.yellow}${result.storyId}:${colors.reset}`);
                for (const de of result.deadEnds) {
                    console.log(`    • ${de.path}: ${de.reason}`);
                }
            }
        }
        
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
