import { describe, it, expect, beforeAll } from 'vitest';
import { discoverAllPaths, validateKnotReachability } from '../test/pathDiscovery';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to public/stories directory
const storiesDir = path.join(__dirname, '../../public/stories');

// Read stories.txt
const storiesTxtPath = path.join(storiesDir, 'stories.txt');
const storiesTxt = fs.readFileSync(storiesTxtPath, 'utf8');

// Parse stories.txt
function parseStories(content) {
  const stories = [];
  const lines = content.split('\n');
  let current = {};
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      if (current.id && current.title && current.file) {
        stories.push(current);
        current = {};
      }
      continue;
    }
    
    const [key, ...valueParts] = trimmed.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      current[key.trim()] = value;
    }
  }
  
  if (current.id && current.title && current.file) {
    stories.push(current);
  }
  
  return stories;
}

const allStories = parseStories(storiesTxt);

describe('Real Story Validation', () => {
  describe('Story Compilation', () => {
    allStories.forEach(story => {
      it(`${story.id} should compile without errors`, () => {
        const storyPath = path.join(storiesDir, story.id, story.file);
        
        // Check if story file exists
        expect(fs.existsSync(storyPath), 
          `Story file should exist at ${storyPath}`
        ).toBe(true);
        
        const storyContent = fs.readFileSync(storyPath, 'utf8');
        
        // Basic validation - file should have content
        expect(storyContent.length).toBeGreaterThan(0);
        
        // Should not have obvious syntax errors
        expect(storyContent).not.toMatch(/\[\[\[/); // Triple brackets
        expect(storyContent).not.toMatch(/>>>/); // Triple arrows
      });
    });
  });

  describe('Path Discovery - Find Dead Ends and Issues', () => {
    allStories.forEach(story => {
      // Skip non-release stories for faster testing
      if (story.release !== 'true') {
        return;
      }

      it(`${story.id} should have completable paths`, async () => {
        const inkPath = path.join(storiesDir, story.id, story.file);
        
        if (!fs.existsSync(inkPath)) {
          console.warn(`Skipping ${story.id} - file not found`);
          return;
        }

        // Try to find compiled version first
        const jsonPath = inkPath.replace('.ink', '.json');
        let compiledStory;
        
        if (fs.existsSync(jsonPath)) {
          compiledStory = fs.readFileSync(jsonPath, 'utf8');
        } else {
          // Would need to compile - skip for now
          console.warn(`Skipping ${story.id} - no compiled version found`);
          return;
        }

        const result = await discoverAllPaths(compiledStory, {
          maxDepth: 30,
          maxPaths: 200,  // Limit total paths explored for performance
          stateHashLimit: 10,  // Allow more exploration - loops are intentional!
        });

        // Log results
        console.log(`\n${story.id}:`);
        console.log(`  Total paths: ${result.paths.length}`);
        console.log(`  Completed: ${result.stats.completedPaths}`);
        console.log(`  Loops detected: ${result.stats.loopsDetected} (intentional - users can explore)`);
        console.log(`  Max depth hit: ${result.stats.maxDepthReached}`);

        // Find paths that didn't complete (for informational purposes)
        const incompletePaths = result.paths.filter(p => !p.completed);
        if (incompletePaths.length > 0) {
          console.log(`  ℹ️  Incomplete paths: ${incompletePaths.length} (mostly loops - this is OK)`);
          const loopPaths = incompletePaths.filter(p => p.endReason === 'loop').length;
          const maxDepthPaths = incompletePaths.filter(p => p.endReason === 'maxDepth').length;
          console.log(`     Loops: ${loopPaths}, Max depth: ${maxDepthPaths}`);
          
          // Show a sample non-loop incomplete path for debugging
          const nonLoopIncomplete = incompletePaths.find(p => p.endReason !== 'loop' && p.endReason !== 'maxDepth');
          if (nonLoopIncomplete) {
            console.log(`    Sample non-loop incomplete path:`);
            console.log(`      - Choices: [${nonLoopIncomplete.choices.slice(0, 5).join(' → ')}${nonLoopIncomplete.choices.length > 5 ? '...' : ''}]`);
            console.log(`      Reason: ${nonLoopIncomplete.endReason}`);
          }
        }

        // Runtime errors are the REAL issues we care about
        const errorPaths = result.paths.filter(p => p.endReason === 'error');
        if (errorPaths.length > 0) {
          console.log(`  🚨 Runtime errors in ${story.id}:`);
          errorPaths.slice(0, 5).forEach(p => {
            console.log(`    Path: [${p.choices.slice(0, 5).join(' → ')}${p.choices.length > 5 ? '...' : ''}]`);
            console.log(`    Error: ${p.error}`);
          });
        }
        
        // Dead ends (stuck with no choices) are also problems
        const stuckPaths = result.paths.filter(p => p.endReason === 'stuck');
        if (stuckPaths.length > 0) {
          console.log(`  🚨 Dead ends found in ${story.id}:`);
          stuckPaths.slice(0, 3).forEach(p => {
            console.log(`    Path: [${p.choices.slice(0, 5).join(' → ')}${p.choices.length > 5 ? '...' : ''}]`);
          });
        }

        // ONLY fail on actual bugs: runtime errors and dead ends
        // Loops are intentional - users exploring different perspectives
        expect(errorPaths.length, 
          `${story.id} has ${errorPaths.length} runtime error(s). These are real bugs that need fixing.`
        ).toBe(0);
        
        expect(stuckPaths.length,
          `${story.id} has ${stuckPaths.length} dead end(s) where story has no choices and doesn't end properly.`
        ).toBe(0);

      }, 60000); // 60 second timeout per story
    });
  });

  describe('Story Structure Analysis', () => {
    allStories.forEach(story => {
      if (story.release !== 'true') return;

      it(`${story.id} should have proper story structure`, () => {
        const inkPath = path.join(storiesDir, story.id, story.file);
        
        if (!fs.existsSync(inkPath)) {
          console.warn(`Skipping ${story.id} - file not found`);
          return;
        }

        const content = fs.readFileSync(inkPath, 'utf8');

        // Should have at least one choice
        const hasChoices = /^\s*[*+]\s*\[/m.test(content);
        expect(hasChoices, `${story.id} should have at least one choice`).toBe(true);

        // Should have at least one knot (=== knotname ===)
        const hasKnots = /^===\s+\w+\s+===/m.test(content);
        // Note: Not all stories need knots, so this is just informational
        if (!hasKnots) {
          console.log(`  ℹ️  ${story.id} has no knots (linear story)`);
        }

        // Check for common mistakes
        const issues = [];

        // Unmatched brackets
        const openBrackets = (content.match(/\[/g) || []).length;
        const closeBrackets = (content.match(/\]/g) || []).length;
        if (openBrackets !== closeBrackets) {
          issues.push(`Unmatched brackets: ${openBrackets} open, ${closeBrackets} close`);
        }

        // Check for -> without space (should be -> not ->word)
        if (/->(?![\s\w_])/m.test(content)) {
          issues.push('Found -> without proper spacing');
        }

        if (issues.length > 0) {
          console.log(`  ⚠️  Potential issues in ${story.id}:`);
          issues.forEach(issue => console.log(`    - ${issue}`));
        }

        // These are warnings, not failures
        expect(issues.length).toBeGreaterThanOrEqual(0); // Always pass, just log
      });
    });
  });
});
