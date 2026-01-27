import { Story } from 'inkjs';

/**
 * Path discovery utility for exploring all possible paths through an Ink story
 */

/**
 * Represents a single path through a story
 * @typedef {Object} StoryPath
 * @property {Array<string>} choices - Sequence of choice texts made
 * @property {Array<number>} choiceIndices - Sequence of choice indices made
 * @property {boolean} completed - Whether path reached an end
 * @property {string} endReason - Reason for ending ('done', 'navigateTo', 'choices', 'maxDepth')
 * @property {Array<string>} content - Text content encountered
 * @property {Array<string>} knots - Knots visited during this path
 * @property {string} navigateToStory - Story ID if path ends with navigateTo
 */

/**
 * Options for path discovery
 * @typedef {Object} DiscoveryOptions
 * @property {number} maxDepth - Maximum choice depth (default: 50)
 * @property {number} maxPaths - Maximum paths to explore (default: 1000)
 * @property {boolean} trackContent - Whether to track text content (default: false)
 * @property {number} stateHashLimit - Max visits to same state (default: 3)
 */

/**
 * Generate a hash of story state to detect loops
 * @param {Story} story - Ink story instance
 * @returns {string} State hash
 */
function generateStateHash(story) {
  try {
    const state = story.state.ToJson();
    // Use a simple hash based on current path and variables
    const pathHash = story.state.currentPathString || '';
    const varsHash = JSON.stringify(story.state.variablesState?.$jsonToken || {});
    return `${pathHash}|${varsHash.slice(0, 100)}`; // Limit vars hash length
  } catch (err) {
    // Fallback to path string only
    return story.state.currentPathString || 'unknown';
  }
}

/**
 * Explore all possible paths through an Ink story
 * @param {string} compiledStoryJson - Compiled story JSON string
 * @param {DiscoveryOptions} options - Discovery options
 * @returns {Promise<{paths: StoryPath[], stats: Object}>} Discovered paths and statistics
 */
export async function discoverAllPaths(compiledStoryJson, options = {}) {
  const {
    maxDepth = 50,
    maxPaths = 1000,
    trackContent = false,
    stateHashLimit = 3,
  } = options;

  const paths = [];
  const stateVisits = new Map(); // Track how many times we've visited each state
  let pathsExplored = 0;
  let pathsAborted = 0;

  // Track navigateTo calls
  let navigateToTarget = null;
  const mockNavigateTo = (storyId) => {
    navigateToTarget = storyId;
    return null;
  };

  // Track exit calls
  let exitCalled = false;
  const mockExit = () => {
    exitCalled = true;
  };

  /**
   * Recursively explore a path from current state
   * @param {Story} story - Story instance
   * @param {Array} choiceHistory - History of choices made
   * @param {Array} choiceIndexHistory - History of choice indices
   * @param {Array} contentHistory - History of text content
   * @param {Array} knotHistory - History of knots visited
   * @param {number} depth - Current depth
   */
  function explorePath(story, choiceHistory, choiceIndexHistory, contentHistory, knotHistory, depth) {
    // Check limits
    if (depth > maxDepth) {
      paths.push({
        choices: choiceHistory,
        choiceIndices: choiceIndexHistory,
        completed: false,
        endReason: 'maxDepth',
        content: trackContent ? contentHistory : [],
        knots: knotHistory,
      });
      pathsAborted++;
      return;
    }

    if (pathsExplored >= maxPaths) {
      return;
    }

    // Generate state hash to detect loops
    const stateHash = generateStateHash(story);
    const visitCount = stateVisits.get(stateHash) || 0;
    
    if (visitCount >= stateHashLimit) {
      // We've been here too many times, likely a loop
      paths.push({
        choices: choiceHistory,
        choiceIndices: choiceIndexHistory,
        completed: false,
        endReason: 'loop',
        content: trackContent ? contentHistory : [],
        knots: knotHistory,
      });
      pathsAborted++;
      return;
    }
    
    stateVisits.set(stateHash, visitCount + 1);

    // Continue story and track knots
    const newContent = [];
    const visitedKnots = new Set(knotHistory);
    
    try {
      while (story.canContinue) {
        const text = story.Continue();
        if (trackContent) {
          newContent.push(text);
        }
        
        // Track current knot after each Continue
        try {
          const currentPath = story.state.currentPathString;
          if (currentPath) {
            const knotMatch = currentPath.match(/^([^.]+)/);
            if (knotMatch && knotMatch[1] && !knotMatch[1].match(/^\d+$/)) {
              visitedKnots.add(knotMatch[1]);
            }
          }
        } catch (err) {
          // Ignore
        }
      }
    } catch (err) {
      // Story had a runtime error (e.g., ran out of content)
      paths.push({
        choices: choiceHistory,
        choiceIndices: choiceIndexHistory,
        completed: false,
        endReason: 'error',
        content: trackContent ? [...contentHistory, ...newContent] : [],
        knots: Array.from(visitedKnots),
        error: err.message || String(err),
      });
      pathsAborted++;
      return;
    }

    const updatedContent = trackContent ? [...contentHistory, ...newContent] : [];
    const updatedKnots = Array.from(visitedKnots);

    // Check if story ended
    if (!story.canContinue && story.currentChoices.length === 0) {
      let endReason = 'done';
      let navigateTarget = null;

      if (navigateToTarget) {
        endReason = 'navigateTo';
        navigateTarget = navigateToTarget;
        navigateToTarget = null; // Reset
      } else if (exitCalled) {
        endReason = 'exit';
        exitCalled = false; // Reset
      }

      paths.push({
        choices: choiceHistory,
        choiceIndices: choiceIndexHistory,
        completed: true,
        endReason,
        content: updatedContent,
        knots: updatedKnots,
        navigateToStory: navigateTarget,
      });
      pathsExplored++;
      return;
    }

    // If no choices available but story can't continue, it's an incomplete path
    if (story.currentChoices.length === 0) {
      paths.push({
        choices: choiceHistory,
        choiceIndices: choiceIndexHistory,
        completed: false,
        endReason: 'stuck',
        content: updatedContent,
        knots: updatedKnots,
      });
      pathsAborted++;
      return;
    }

    // Explore each choice
    const currentChoices = story.currentChoices;
    for (let i = 0; i < currentChoices.length; i++) {
      if (pathsExplored >= maxPaths) {
        break;
      }

      // Save state before making choice
      const savedState = story.state.ToJson();

      // Make choice
      const choiceText = currentChoices[i].text;
      story.ChooseChoiceIndex(i);

      // Recursively explore this path
      explorePath(
        story,
        [...choiceHistory, choiceText],
        [...choiceIndexHistory, i],
        updatedContent,
        updatedKnots,
        depth + 1
      );

      // Restore state for next choice
      story.state.LoadJson(savedState);
      
      // Decrement state visit counter since we're backtracking
      stateVisits.set(stateHash, (stateVisits.get(stateHash) || 1) - 1);
    }
  }

  // Start exploration from beginning
  const story = new Story(compiledStoryJson);
  
  // Bind external functions
  story.BindExternalFunction('navigateTo', mockNavigateTo);
  story.BindExternalFunction('exit', mockExit);
  
  // Add error handler to catch runtime errors
  const runtimeErrors = [];
  story.onError = (message, type) => {
    runtimeErrors.push({ message, type });
  };

  explorePath(story, [], [], [], [], 0);
  
  // If we encountered runtime errors, include them in stats
  if (runtimeErrors.length > 0) {
    console.error('Runtime errors encountered:', runtimeErrors);
  }

  return {
    paths,
    stats: {
      totalPaths: paths.length,
      completedPaths: paths.filter(p => p.completed).length,
      abortedPaths: pathsAborted,
      maxDepthReached: paths.some(p => p.endReason === 'maxDepth'),
      loopsDetected: paths.filter(p => p.endReason === 'loop').length,
      navigateToPaths: paths.filter(p => p.navigateToStory).length,
      runtimeErrors: runtimeErrors.length,
    },
  };
}

/**
 * Find the shortest path to a specific knot
 * @param {string} compiledStoryJson - Compiled story JSON
 * @param {string} targetKnot - Target knot name
 * @param {DiscoveryOptions} options - Discovery options
 * @returns {Promise<StoryPath|null>} Shortest path to knot, or null if not found
 */
export async function findPathToKnot(compiledStoryJson, targetKnot, options = {}) {
  const { paths } = await discoverAllPaths(compiledStoryJson, {
    ...options,
    maxDepth: options.maxDepth || 20,
  });

  // Find paths that visit the target knot
  const pathsToKnot = paths.filter(p => p.knots.includes(targetKnot));

  if (pathsToKnot.length === 0) {
    return null;
  }

  // Return the shortest path
  return pathsToKnot.reduce((shortest, current) => {
    return current.choices.length < shortest.choices.length ? current : shortest;
  });
}

/**
 * Validate that all knots in a story are reachable
 * @param {string} compiledStoryJson - Compiled story JSON
 * @param {Array<string>} knots - List of knot names to check
 * @param {DiscoveryOptions} options - Discovery options
 * @returns {Promise<{reachable: Array<string>, unreachable: Array<string>}>}
 */
export async function validateKnotReachability(compiledStoryJson, knots, options = {}) {
  const { paths } = await discoverAllPaths(compiledStoryJson, {
    ...options,
    maxDepth: options.maxDepth || 30,
  });

  const visitedKnots = new Set();
  paths.forEach(path => {
    path.knots.forEach(knot => visitedKnots.add(knot));
  });

  const reachable = knots.filter(k => visitedKnots.has(k));
  const unreachable = knots.filter(k => !visitedKnots.has(k));

  return { reachable, unreachable };
}
