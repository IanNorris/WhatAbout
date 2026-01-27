/**
 * Test utilities and helpers for unit tests
 */

/**
 * Create a mock fetch response
 * @param {*} data - Data to return
 * @param {boolean} ok - Whether response is ok
 * @param {number} status - HTTP status code
 * @returns {Promise<Response>}
 */
export function mockFetchResponse(data, ok = true, status = 200) {
  return Promise.resolve({
    ok,
    status,
    json: async () => data,
    text: async () => typeof data === 'string' ? data : JSON.stringify(data),
    statusText: ok ? 'OK' : 'Error',
  });
}

/**
 * Mock fetch to return specific responses
 * @param {Object} responses - Map of URLs to responses
 * @returns {Function} Mock fetch function
 */
export function createMockFetch(responses) {
  return vi.fn((url) => {
    const response = responses[url];
    if (!response) {
      return Promise.reject(new Error(`No mock response for ${url}`));
    }
    return mockFetchResponse(response.data, response.ok ?? true, response.status ?? 200);
  });
}

/**
 * Wait for async operations to complete
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
export function wait(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a minimal compiled Ink story JSON for testing
 * @param {Object} options - Story options
 * @returns {Object} Compiled story JSON
 */
export function createMockInkStory(options = {}) {
  const {
    text = 'Test story content',
    choices = [],
    knots = {},
  } = options;

  return {
    inkVersion: 21,
    root: [
      ['^' + text, '\n', ['ev', { '^->': 'main.0.2' }, 'out', '/ev', 'end', []], 'done', knots],
    ],
  };
}
