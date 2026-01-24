/**
 * Parse stories.txt file
 * @param {string} content - Raw text content
 * @returns {Array} Array of story objects
 */
function parseStoriesTxt(content) {
    const stories = [];
    const lines = content.split('\n');
    let currentStory = {};
    
    for (const line of lines) {
        const trimmed = line.trim();
        
        // Skip empty lines and comments
        if (trimmed === '' || trimmed.startsWith('#')) {
            // If we have a complete story, add it
            if (currentStory.id && currentStory.title && currentStory.description && currentStory.file) {
                stories.push({
                    id: currentStory.id,
                    title: currentStory.title,
                    description: currentStory.description,
                    inkPath: `/stories/${currentStory.file}`,
                    release: currentStory.release === 'true' // Parse as boolean
                });
                currentStory = {};
            }
            continue;
        }
        
        // Parse key: value format
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex > 0) {
            const key = trimmed.substring(0, colonIndex).trim();
            const value = trimmed.substring(colonIndex + 1).trim();
            
            if (key && value) {
                currentStory[key] = value;
            }
        }
    }
    
    // Don't forget the last story
    if (currentStory.id && currentStory.title && currentStory.description && currentStory.file) {
        stories.push({
            id: currentStory.id,
            title: currentStory.title,
            description: currentStory.description,
            inkPath: `/stories/${currentStory.file}`,
            release: currentStory.release === 'true'
        });
    }
    
    return stories;
}

// Story list - loaded from stories.txt
let cachedStories = null;

/**
 * Load story list from stories.txt
 * @returns {Promise<Array>} Array of story metadata
 */
export async function loadStoryList() {
    if (cachedStories) {
        return cachedStories;
    }
    
    try {
        const response = await fetch('/stories/stories.txt');
        if (!response.ok) {
            throw new Error(`Failed to load stories.txt: ${response.statusText}`);
        }
        
        const content = await response.text();
        const allStories = parseStoriesTxt(content);
        
        // Filter based on environment
        const isProduction = import.meta.env.PROD;
        cachedStories = isProduction 
            ? allStories.filter(story => story.release) 
            : allStories;
        
        return cachedStories;
    } catch (error) {
        console.error('Error loading story list:', error);
        // Fallback to hardcoded list if file can't be loaded
        return [
            {
                id: 'age-verification',
                title: 'Age Verification',
                description: 'Should we verify age online? The pros, cons, and tech reality.',
                inkPath: '/stories/age_verification.ink',
                release: true
            }
        ];
    }
}

/**
 * Load and compile an .ink file
 * @param {string} inkPath - Path to .ink file (relative to public/)
 * @returns {Promise<object>} Compiled story JSON
 */
export async function loadInkStory(inkPath) {
    try {
        const response = await fetch(inkPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${inkPath}: ${response.statusText}`);
        }
        
        const inkSource = await response.text();
        
        // Compile .ink to JSON using inkjs compiler
        const { Compiler } = await import('inkjs/compiler/Compiler');
        const compiler = new Compiler(inkSource);
        const compiledStory = compiler.Compile();
        
        return compiledStory.ToJson();
    } catch (error) {
        console.error(`Error loading Ink story from ${inkPath}:`, error);
        throw error;
    }
}
