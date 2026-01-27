import { describe, it, expect } from 'vitest';
import { Story } from 'inkjs/engine/Story';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('currentPathString Reliability Test', () => {
  let story;
  const positions = [];

  it('should track position changes through story navigation', () => {
    // Load test story
    const storyJson = fs.readFileSync(
      path.join(__dirname, '../test/fixtures/position-tracking.json'),
      'utf8'
    );
    story = new Story(storyJson);

    console.log('\n=== Testing currentPathString Reliability ===\n');

    // Helper to record current position
    const recordPosition = (description) => {
      const pos = {
        description,
        currentPathString: story.state.currentPathString,
        currentText: story.currentText.trim(),
        hasChoices: story.currentChoices.length > 0,
        choiceCount: story.currentChoices.length
      };
      positions.push(pos);
      console.log(`\n${description}:`);
      console.log(`  currentPathString: "${pos.currentPathString}"`);
      console.log(`  Text: ${pos.currentText}`);
      console.log(`  Choices: ${pos.choiceCount}`);
      return pos;
    };

    // Start story - check initial state
    console.log('\n--- Initial State (before any Continue) ---');
    console.log(`canContinue: ${story.canContinue}`);
    console.log(`currentChoices: ${story.currentChoices.length}`);
    console.log(`currentPathString: "${story.state.currentPathString}"`);
    
    const pos1 = recordPosition('Initial position (before Continue)');
    
    // Continue to get first content
    console.log('\n--- Calling Continue() ---');
    while (story.canContinue) {
      story.Continue();
    }
    
    const pos1b = recordPosition('After first Continue (Start knot)');

    // Make first choice: Go to Section A
    console.log(`\nAvailable choices: ${story.currentChoices.map(c => c.text).join(', ')}`);
    if (story.currentChoices.length === 0) {
      console.error('\n⚠️  ERROR: No choices available after Continue!');
      console.log('Story seems to have ended immediately.');
      console.log('This suggests the story structure is incorrect.');
      throw new Error('Story has no choices - test cannot proceed');
    }
    expect(story.currentChoices.length).toBeGreaterThan(0);
    story.ChooseChoiceIndex(0); // "Go to Section A"
    story.Continue();
    const pos2 = recordPosition('After choosing Section A');

    // From Section A, go deeper
    expect(story.currentChoices.length).toBeGreaterThan(0);
    story.ChooseChoiceIndex(0); // "Go deeper into A"
    story.Continue();
    const pos3 = recordPosition('After going to DeepA stitch');

    // Go back to Section A
    expect(story.currentChoices.length).toBeGreaterThan(0);
    story.ChooseChoiceIndex(0); // "Go back to Section A"
    story.Continue();
    const pos4 = recordPosition('Back at Section A (revisiting)');

    // Now go to Section B
    expect(story.currentChoices.length).toBeGreaterThan(0);
    story.ChooseChoiceIndex(2); // "Go to Section B"
    story.Continue();
    const pos5 = recordPosition('At Section B');

    // Go to Section B Part 1
    expect(story.currentChoices.length).toBeGreaterThan(0);
    story.ChooseChoiceIndex(0); // "Go to Section B.1"
    story.Continue();
    const pos6 = recordPosition('At Section B.Part1 stitch');

    // Continue to Part 2
    expect(story.currentChoices.length).toBeGreaterThan(0);
    story.ChooseChoiceIndex(0); // "Continue"
    story.Continue();
    const pos7 = recordPosition('At Section B.Part2 stitch');

    // Print summary
    console.log('\n=== POSITION SUMMARY ===');
    positions.forEach((pos, idx) => {
      console.log(`${idx + 1}. ${pos.description}`);
      console.log(`   Path: "${pos.currentPathString}"`);
    });

    // VERIFICATION TESTS
    console.log('\n=== VERIFICATION ===\n');

    // Test 1: Position strings should exist and not be null/undefined
    console.log('Test 1: All positions have valid currentPathString values');
    positions.forEach((pos, idx) => {
      console.log(`  Position ${idx + 1}: ${pos.currentPathString !== null && pos.currentPathString !== undefined ? '✓' : '✗'} "${pos.currentPathString}"`);
      expect(pos.currentPathString).toBeDefined();
    });

    // Test 2: Position should change when we navigate to different knots
    console.log('\nTest 2: Position changes when navigating to different knots');
    console.log(`  Start -> SectionA: ${pos1.currentPathString !== pos2.currentPathString ? '✓' : '✗'}`);
    console.log(`    "${pos1.currentPathString}" -> "${pos2.currentPathString}"`);
    expect(pos1.currentPathString).not.toBe(pos2.currentPathString);
    
    console.log(`  SectionA -> SectionA.DeepA: ${pos2.currentPathString !== pos3.currentPathString ? '✓' : '✗'}`);
    console.log(`    "${pos2.currentPathString}" -> "${pos3.currentPathString}"`);
    expect(pos2.currentPathString).not.toBe(pos3.currentPathString);
    
    console.log(`  DeepA -> SectionB: ${pos3.currentPathString !== pos5.currentPathString ? '✓' : '✗'}`);
    console.log(`    "${pos3.currentPathString}" -> "${pos5.currentPathString}"`);
    expect(pos3.currentPathString).not.toBe(pos5.currentPathString);

    // Test 3: Position when revisiting same knot
    console.log('\nTest 3: Position when revisiting same knot (SectionA)');
    console.log(`  First visit (pos2): "${pos2.currentPathString}"`);
    console.log(`  Second visit (pos4): "${pos4.currentPathString}"`);
    console.log(`  Are they equal? ${pos2.currentPathString === pos4.currentPathString ? '✓ YES' : '✗ NO'}`);
    // We expect them to be the same if currentPathString is based on knot/stitch location
    
    // Test 4: Stitches should have different paths
    console.log('\nTest 4: Stitches within same knot have different paths');
    console.log(`  SectionB: "${pos5.currentPathString}"`);
    console.log(`  SectionB.Part1: "${pos6.currentPathString}"`);
    console.log(`  SectionB.Part2: "${pos7.currentPathString}"`);
    console.log(`  All unique? ${(pos5.currentPathString !== pos6.currentPathString && 
                                 pos6.currentPathString !== pos7.currentPathString &&
                                 pos5.currentPathString !== pos7.currentPathString) ? '✓ YES' : '✗ NO'}`);

    // Test 5: Check if currentPathString contains useful information
    console.log('\nTest 5: Does currentPathString contain knot/stitch names?');
    positions.forEach((pos, idx) => {
      const hasKnotInfo = pos.currentPathString.length > 0;
      console.log(`  Position ${idx + 1}: ${hasKnotInfo ? '✓' : '✗'} (length: ${pos.currentPathString.length})`);
    });

    console.log('\n=== CONCLUSION ===');
    
    // Determine if currentPathString is reliable for position tracking
    const allDefined = positions.every(p => p.currentPathString !== null && p.currentPathString !== undefined);
    const changesOnNavigation = pos1.currentPathString !== pos2.currentPathString;
    const distinguishesStitches = pos5.currentPathString !== pos6.currentPathString;
    
    console.log(`✓ All positions have defined currentPathString: ${allDefined}`);
    console.log(`✓ Changes when navigating to different knots: ${changesOnNavigation}`);
    console.log(`✓ Distinguishes stitches within knots: ${distinguishesStitches}`);
    
    const isReliable = allDefined && changesOnNavigation && distinguishesStitches;
    
    if (isReliable) {
      console.log('\n✅ RESULT: currentPathString is RELIABLE for position tracking');
      console.log('   Can use it to detect cycles (revisiting same position in a path)');
    } else {
      console.log('\n❌ RESULT: currentPathString is NOT RELIABLE');
      console.log('   Need alternative approach for position tracking');
    }
    
    expect(isReliable).toBe(true);
  });
});
