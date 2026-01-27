/**
 * Routing utilities for hash-based navigation
 */

/**
 * Parse the current URL hash
 * @returns {Object} Parsed route with type and params
 */
export function parseHash() {
  const hash = window.location.hash.slice(1); // Remove leading #
  
  if (!hash || hash === '/' || hash === '') {
    return { type: 'hub' };
  }
  
  // Match /#/story/{story-id}
  const storyMatch = hash.match(/^\/story\/([^\/]+)$/);
  if (storyMatch) {
    return {
      type: 'story',
      storyId: storyMatch[1]
    };
  }
  
  // Unknown route, default to hub
  return { type: 'hub' };
}

/**
 * Navigate to the hub
 */
export function navigateToHub() {
  window.location.hash = '#/';
}

/**
 * Navigate to a specific story
 * @param {string} storyId - The story ID
 */
export function navigateToStory(storyId) {
  window.location.hash = `#/story/${storyId}`;
}

/**
 * Get the current hash without triggering navigation
 * @returns {string} Current hash
 */
export function getCurrentHash() {
  return window.location.hash;
}
