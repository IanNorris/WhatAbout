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
                // Construct path: /stories/{id}/{file}
                const inkPath = `/stories/${currentStory.id}/${currentStory.file}`;
                
                stories.push({
                    id: currentStory.id,
                    title: currentStory.title,
                    description: currentStory.description,
                    inkPath: inkPath,
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
        const inkPath = `/stories/${currentStory.id}/${currentStory.file}`;
        
        stories.push({
            id: currentStory.id,
            title: currentStory.title,
            description: currentStory.description,
            inkPath: inkPath,
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
 * Recursively resolve INCLUDE statements in ink source
 * @param {string} source - Ink source code
 * @param {string} basePath - Base path for resolving relative includes
 * @returns {Promise<string>} Resolved source with all includes expanded
 */
async function resolveIncludes(source, basePath) {
    // Match INCLUDE statements - use [ \t]* for leading whitespace to avoid matching newlines
    const includePattern = /^[ \t]*INCLUDE\s+(.+\.ink)\s*$/gm;
    const includes = [];
    let match;
    
    // Find all INCLUDE statements
    while ((match = includePattern.exec(source)) !== null) {
        includes.push({
            fullMatch: match[0],
            filename: match[1].trim(),
            index: match.index
        });
    }
    
    // If no includes, return source as-is
    if (includes.length === 0) {
        return source;
    }
    
    // Collect all included content
    const includedContent = [];
    
    for (const include of includes) {
        const includePath = `${basePath}/${include.filename}`;
        
        try {
            const response = await fetch(includePath);
            if (!response.ok) {
                throw new Error(`Failed to load include ${includePath}: ${response.statusText}`);
            }
            
            let includeSource = await response.text();
            
            // Recursively resolve includes in the included file
            includeSource = await resolveIncludes(includeSource, basePath);
            
            // Add to collected content
            includedContent.push(includeSource);
        } catch (error) {
            console.error(`Error loading include ${include.filename}:`, error);
            throw error;
        }
    }
    
    // Remove all INCLUDE statements from the source
    let resolvedSource = source.replace(includePattern, '');
    
    // Append all included content at the END (knot definitions can be anywhere)
    resolvedSource = resolvedSource + '\n\n' + includedContent.join('\n\n');
    
    return resolvedSource;
}

/**
 * Load and compile an .ink file
 * @param {string} inkPath - Path to .ink file (relative to public/)
 * @returns {Promise<object>} Compiled story JSON
 */
export async function loadInkStory(inkPath) {
    try {
        // Try to load pre-compiled .json first (optional performance optimization)
        const jsonPath = inkPath.replace('.ink', '.json');
        
        try {
            const jsonResponse = await fetch(jsonPath);
            if (jsonResponse.ok) {
                console.log(`Loading pre-compiled story from ${jsonPath}`);
                const jsonData = await jsonResponse.json();
                console.log(`Successfully loaded pre-compiled JSON: ${JSON.stringify(jsonData).length} chars`);
                return jsonData;
            }
        } catch (e) {
            console.log(`Could not load pre-compiled version (${e.message}), will compile at runtime`);
        }
        
        console.log(`Compiling story at runtime from ${inkPath}`);
        
        // Extract base path for resolving includes
        const lastSlash = inkPath.lastIndexOf('/');
        const basePath = lastSlash > 0 ? inkPath.substring(0, lastSlash) : '';
        
        // Load .ink source
        const response = await fetch(inkPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${inkPath}: ${response.statusText}`);
        }
        
        let inkSource = await response.text();
        
        // Resolve all INCLUDE statements
        inkSource = await resolveIncludes(inkSource, basePath);
        
        console.log(`Resolved source length: ${inkSource.length} characters`);
        
        // Show a chunk from the middle to see if main content is there
        const midStart = Math.floor(inkSource.length / 2) - 250;
        console.log(`Middle 500 chars (from ${midStart}):`, inkSource.substring(midStart, midStart + 500));
        
        // Look for the story start
        const storyStartIndex = inkSource.indexOf("Lets talk about");
        if (storyStartIndex >= 0) {
            console.log(`Found "Lets talk about" at position ${storyStartIndex}`);
            console.log('Content around it:', inkSource.substring(storyStartIndex - 50, storyStartIndex + 200));
        } else {
            console.log('⚠️ WARNING: Could not find "Lets talk about" in resolved source!');
        }
        
        // Compile .ink to JSON using inkjs compiler
        const { Compiler } = await import('inkjs/compiler/Compiler');
        const compiler = new Compiler(inkSource);
        
        let compiledStory;
        try {
            compiledStory = compiler.Compile();
        } catch (compileError) {
            // Compilation failed - check for errors
            if (compiler.errors && compiler.errors.length > 0) {
                console.error('Ink compilation errors:', compiler.errors);
                throw new Error(`Ink compilation failed:\n${compiler.errors.join('\n')}`);
            }
            // If no specific errors, rethrow the original error
            throw compileError;
        }
        
        // Log warnings in development mode only (they don't prevent the story from working)
        if (compiler.warnings && compiler.warnings.length > 0 && import.meta.env.DEV) {
            console.info(`📝 Ink compilation completed with ${compiler.warnings.length} warning(s) for ${inkPath}:`, compiler.warnings);
        }
        
        const jsonOutput = compiledStory.ToJson();
        console.log(`Compiled to JSON: ${jsonOutput.length} characters`);
        console.log('First 500 chars of JSON:', jsonOutput.substring(0, 500));
        
        return jsonOutput;
    } catch (error) {
        console.error(`Error loading Ink story from ${inkPath}:`, error);
        throw error;
    }
}
