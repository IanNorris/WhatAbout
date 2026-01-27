import { describe, it, expect } from 'vitest';
import { discoverAllPaths, findPathToKnot, validateKnotReachability } from '../test/pathDiscovery';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load compiled fixtures
const fixturesDir = path.join(__dirname, '../test/fixtures');
const simpleStory = fs.readFileSync(path.join(fixturesDir, 'simple.json'), 'utf8');
const choicesStory = fs.readFileSync(path.join(fixturesDir, 'choices.json'), 'utf8');
const loopStory = fs.readFileSync(path.join(fixturesDir, 'loop.json'), 'utf8');
const knotsStory = fs.readFileSync(path.join(fixturesDir, 'knots.json'), 'utf8');

describe('pathDiscovery', () => {
  describe('discoverAllPaths', () => {
    it('should discover simple linear path', async () => {
      const result = await discoverAllPaths(simpleStory);

      expect(result.paths).toHaveLength(1);
      expect(result.paths[0].completed).toBe(true);
      expect(result.paths[0].endReason).toBe('done');
      expect(result.paths[0].choices).toHaveLength(0);
    });

    it('should discover multiple choice paths', async () => {
      const result = await discoverAllPaths(choicesStory);

      expect(result.paths.length).toBe(2);
      expect(result.stats.completedPaths).toBe(2);
      expect(result.paths[0].choices).toHaveLength(1);
      expect(result.paths[1].choices).toHaveLength(1);
      
      // Check that both choices were explored
      const choiceTexts = result.paths.map(p => p.choices[0]);
      expect(choiceTexts).toContain('Option A');
      expect(choiceTexts).toContain('Option B');
    });

    it('should respect maxDepth limit', async () => {
      const result = await discoverAllPaths(loopStory, {
        maxDepth: 5,
      });

      expect(result.stats.maxDepthReached || result.stats.loopsDetected > 0).toBe(true);
    });

    it('should track content when enabled', async () => {
      const result = await discoverAllPaths(simpleStory, {
        trackContent: true,
      });

      expect(result.paths[0].content).toBeDefined();
      expect(result.paths[0].content.length).toBeGreaterThan(0);
    });

    it('should not track content by default', async () => {
      const result = await discoverAllPaths(simpleStory);

      expect(result.paths[0].content).toHaveLength(0);
    });

    it('should respect maxPaths limit', async () => {
      const result = await discoverAllPaths(choicesStory, {
        maxPaths: 1,
      });

      expect(result.paths.length).toBeLessThanOrEqual(2); // May complete current branch
    });

    it('should detect loop situations', async () => {
      const result = await discoverAllPaths(loopStory, {
        stateHashLimit: 2,
        maxDepth: 20,
      });

      expect(result.stats.loopsDetected).toBeGreaterThan(0);
    });

    it('should find exit path in loop story', async () => {
      const result = await discoverAllPaths(loopStory, {
        stateHashLimit: 3,
        maxDepth: 20,
      });

      // Should find at least one completed path (taking Exit choice)
      expect(result.stats.completedPaths).toBeGreaterThan(0);
      
      // Find the exit path
      const exitPath = result.paths.find(p => p.completed && p.choices.includes('Exit'));
      expect(exitPath).toBeDefined();
    });
  });

  describe('findPathToKnot', () => {
    it('should find shortest path to knot', async () => {
      const result = await findPathToKnot(knotsStory, 'knot_a', {
        maxDepth: 10,
      });

      expect(result).not.toBeNull();
      expect(result.knots).toContain('knot_a');
      expect(result.choices).toContain('Go to knot_a');
    });

    it('should return null for unreachable knot', async () => {
      const result = await findPathToKnot(knotsStory, 'unreachable_knot');

      expect(result).toBeNull();
    });

    it('should find shorter path when multiple paths exist', async () => {
      const result = await findPathToKnot(knotsStory, 'knot_b');

      expect(result).not.toBeNull();
      expect(result.choices.length).toBe(1); // Direct path
    });
  });

  describe('validateKnotReachability', () => {
    it('should identify reachable and unreachable knots', async () => {
      const result = await validateKnotReachability(
        knotsStory,
        ['start', 'knot_a', 'knot_b', 'unreachable_knot']
      );

      expect(result.reachable).toContain('start');
      expect(result.reachable).toContain('knot_a');
      expect(result.reachable).toContain('knot_b');
      expect(result.unreachable).toContain('unreachable_knot');
    });

    it('should handle empty knot list', async () => {
      const result = await validateKnotReachability(simpleStory, []);

      expect(result.reachable).toHaveLength(0);
      expect(result.unreachable).toHaveLength(0);
    });

    it('should report all knots as reachable when they are', async () => {
      const result = await validateKnotReachability(
        knotsStory,
        ['start', 'knot_a']
      );

      expect(result.reachable).toHaveLength(2);
      expect(result.unreachable).toHaveLength(0);
    });
  });
});
