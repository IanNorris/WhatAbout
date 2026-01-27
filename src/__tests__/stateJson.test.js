import { describe, it, expect } from 'vitest';
import { Story } from 'inkjs/engine/Story';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('State JSON Tracking Test', () => {
  it('should detect position changes and revisits via state JSON', () => {
    // Load test story
    const storyJson = fs.readFileSync(
      path.join(__dirname, '../test/fixtures/position-tracking.json'),
      'utf8'
    );
    const story = new Story(storyJson);

    console.log('\n=== Testing State JSON for Position Tracking ===\n');

    const states = [];

    // Helper to capture and compare states
    const captureState = (description) => {
      const stateJson = story.state.ToJson();
      const state = {
        description,
        stateJson,
        stateLength: stateJson.length,
        currentText: story.currentText.trim(),
        choiceCount: story.currentChoices.length,
        choices: story.currentChoices.map(c => c.text)
      };
      states.push(state);
      console.log(`${description}:`);
      console.log(`  State JSON length: ${state.stateLength} chars`);
      console.log(`  Text: "${state.currentText}"`);
      console.log(`  Choices (${state.choiceCount}): ${state.choices.slice(0, 2).join(', ')}${state.choiceCount > 2 ? '...' : ''}`);
      return state;
    };

    // Start story
    while (story.canContinue) story.Continue();
    const state1 = captureState('1. At Start knot');

    // Go to Section A
    story.ChooseChoiceIndex(0); // "Go to Section A"
    while (story.canContinue) story.Continue();
    const state2 = captureState('2. At Section A');

    // Go deeper into A
    story.ChooseChoiceIndex(0); // "Go deeper into A"
    while (story.canContinue) story.Continue();
    const state3 = captureState('3. At Section A.DeepA');

    // Go back to Section A (revisit)
    story.ChooseChoiceIndex(0); // "Go back to Section A"
    while (story.canContinue) story.Continue();
    const state4 = captureState('4. Back at Section A (revisit)');

    // Go to Section B
    story.ChooseChoiceIndex(2); // "Go to Section B"
    while (story.canContinue) story.Continue();
    const state5 = captureState('5. At Section B');

    // Go to Section B.Part1
    story.ChooseChoiceIndex(0); // "Go to Section B.1"
    while (story.canContinue) story.Continue();
    const state6 = captureState('6. At Section B.Part1');

    // Go to Section B.Part2
    story.ChooseChoiceIndex(0); // "Continue"
    while (story.canContinue) story.Continue();
    const state7 = captureState('7. At Section B.Part2');

    console.log('\n=== ANALYSIS ===\n');

    // Test 1: States should be different lengths for different positions
    console.log('Test 1: State JSON changes when navigating');
    const uniqueStates = new Set(states.map(s => s.stateJson)).size;
    console.log(`  Unique states: ${uniqueStates} out of ${states.length} captured`);
    console.log(`  ✓ States change: ${uniqueStates > 1 ? 'YES' : 'NO'}`);

    // Test 2: State should differ between different positions
    console.log('\nTest 2: Different positions have different states');
    console.log(`  Start vs SectionA: ${state1.stateJson !== state2.stateJson ? '✓ DIFFERENT' : '✗ SAME'}`);
    console.log(`  SectionA vs DeepA: ${state2.stateJson !== state3.stateJson ? '✓ DIFFERENT' : '✗ SAME'}`);
    console.log(`  DeepA vs SectionB: ${state3.stateJson !== state5.stateJson ? '✓ DIFFERENT' : '✗ SAME'}`);
    console.log(`  SectionB vs Part1: ${state5.stateJson !== state6.stateJson ? '✓ DIFFERENT' : '✗ SAME'}`);

    // Test 3: Key test - What about revisiting same location?
    console.log('\nTest 3: Revisiting same location (SectionA)');
    console.log(`  First visit (state2): length ${state2.stateLength}`);
    console.log(`  Second visit (state4): length ${state4.stateLength}`);
    console.log(`  States are identical: ${state2.stateJson === state4.stateJson ? '✗ YES - cannot distinguish!' : '✓ NO - can detect revisit!'}`);
    
    if (state2.stateJson !== state4.stateJson) {
      console.log('  ✓ State differs on revisit (likely due to choice history)');
    } else {
      console.log('  ✗ State is identical on revisit (cannot detect cycles this way)');
    }

    // Test 4: Can we use state hashing to detect loops?
    console.log('\nTest 4: State hashing for loop detection');
    const stateMap = new Map();
    let revisitDetected = false;
    
    states.forEach((state, idx) => {
      if (stateMap.has(state.stateJson)) {
        const firstVisitIdx = stateMap.get(state.stateJson);
        console.log(`  ⚠️  State ${idx + 1} matches state ${firstVisitIdx + 1}`);
        console.log(`      "${states[firstVisitIdx].description}" === "${state.description}"`);
        revisitDetected = true;
      } else {
        stateMap.set(state.stateJson, idx);
      }
    });
    
    if (!revisitDetected) {
      console.log('  ✓ No exact state duplicates found');
      console.log('  ✓ Each navigation creates unique state (includes choice history)');
    }

    // Test 5: What's in the state JSON?
    console.log('\nTest 5: What does state JSON contain?');
    const state1Parsed = JSON.parse(state1.stateJson);
    const state2Parsed = JSON.parse(state2.stateJson);
    
    console.log('  State keys:', Object.keys(state1Parsed).join(', '));
    console.log('  Has callstack:', 'callstack' in state1Parsed ? '✓ YES' : '✗ NO');
    console.log('  Has variablesState:', 'variablesState' in state1Parsed ? '✓ YES' : '✗ NO');
    console.log('  Has currentChoices:', 'currentChoices' in state1Parsed ? '✓ YES' : '✗ NO');
    
    // Sample some state content
    console.log('\n  Sample from State 1 (Start):');
    console.log(`    callstack: ${JSON.stringify(state1Parsed.callstack || 'none').substring(0, 100)}...`);
    
    console.log('\n  Sample from State 2 (SectionA):');
    console.log(`    callstack: ${JSON.stringify(state2Parsed.callstack || 'none').substring(0, 100)}...`);

    console.log('\n=== CONCLUSION ===\n');

    // Determine if state JSON is viable for position tracking
    const statesAreUnique = uniqueStates === states.length;
    const canDistinguishPositions = state1.stateJson !== state2.stateJson;
    const revisitsCreateNewState = state2.stateJson !== state4.stateJson;

    console.log(`✓ States change on navigation: ${canDistinguishPositions}`);
    console.log(`✓ Each state is unique (includes history): ${statesAreUnique}`);
    console.log(`✓ Revisits create different state: ${revisitsCreateNewState}`);

    if (statesAreUnique && canDistinguishPositions) {
      if (revisitsCreateNewState) {
        console.log('\n✅ RESULT: State JSON is EXCELLENT for tracking position + history');
        console.log('   Each visit to same location creates unique state due to choice history');
        console.log('   Can use state hashing with visit limit to allow loops while preventing infinite cycles');
      } else {
        console.log('\n⚠️  RESULT: State JSON is GOOD but revisits are identical');
        console.log('   Need visit counter (stateHashLimit) to allow limited revisits');
      }
    } else {
      console.log('\n❌ RESULT: State JSON is NOT reliable for position tracking');
    }

    // Assertions
    expect(canDistinguishPositions).toBe(true);
    expect(uniqueStates).toBeGreaterThan(1);
  });
});
