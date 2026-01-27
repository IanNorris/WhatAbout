import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { parseHash, navigateToHub, navigateToStory } from '../utils/routing';

describe('routing utilities', () => {
  let originalHash;

  beforeEach(() => {
    originalHash = window.location.hash;
  });

  afterEach(() => {
    window.location.hash = originalHash;
  });

  describe('parseHash', () => {
    it('should parse empty hash as hub route', () => {
      window.location.hash = '';
      const result = parseHash();
      expect(result).toEqual({ type: 'hub' });
    });

    it('should parse # as hub route', () => {
      window.location.hash = '#';
      const result = parseHash();
      expect(result).toEqual({ type: 'hub' });
    });

    it('should parse story hash', () => {
      window.location.hash = '#/story/age-verification';
      const result = parseHash();
      expect(result).toEqual({
        type: 'story',
        storyId: 'age-verification',
      });
    });

    it('should handle story hash without leading #', () => {
      window.location.hash = '/story/digital-id';
      const result = parseHash();
      expect(result).toEqual({
        type: 'story',
        storyId: 'digital-id',
      });
    });

    it('should handle malformed hash gracefully', () => {
      window.location.hash = '#invalid/path/with/too/many/parts';
      const result = parseHash();
      expect(result).toEqual({ type: 'hub' });
    });

    it('should handle empty story id', () => {
      window.location.hash = '#/story/';
      const result = parseHash();
      expect(result).toEqual({ type: 'hub' });
    });
  });

  describe('navigateToHub', () => {
    it('should set hash to #/', () => {
      window.location.hash = '#/story/some-story';
      navigateToHub();
      expect(window.location.hash).toBe('#/');
    });
  });

  describe('navigateToStory', () => {
    it('should set hash to story path', () => {
      navigateToStory('age-verification');
      expect(window.location.hash).toBe('#/story/age-verification');
    });

    it('should handle story ids with special characters', () => {
      navigateToStory('my-story-123');
      expect(window.location.hash).toBe('#/story/my-story-123');
    });
  });
});
