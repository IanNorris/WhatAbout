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
                throw new Error(`Could not find file: ${include.filename}\n\nMake sure the file exists in the same folder as your main story file.\nPath attempted: ${includePath}`);
            }
            
            let includeSource = await response.text();
            
            // Recursively resolve includes in the included file
            includeSource = await resolveIncludes(includeSource, basePath);
            
            // Add to collected content
            includedContent.push(includeSource);
        } catch (error) {
            // Re-throw with helpful context
            if (error.message.includes('Could not find file')) {
                throw error; // Already has good message
            }
            throw new Error(`Error loading ${include.filename}: ${error.message}`);
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
                const jsonData = await jsonResponse.json();
                if (import.meta.env.DEV) {
                    console.log(`📄 Loaded pre-compiled story from ${jsonPath}`);
                }
                return jsonData;
            }
        } catch (e) {
            // No pre-compiled version or it's invalid, will compile at runtime
        }
        
        if (import.meta.env.DEV) {
            console.log(`🔨 Compiling story at runtime from ${inkPath}`);
        }
        
        // Extract base path for resolving includes
        const lastSlash = inkPath.lastIndexOf('/');
        const basePath = lastSlash > 0 ? inkPath.substring(0, lastSlash) : '';
        
        // Load .ink source
        const response = await fetch(inkPath);
        if (!response.ok) {
            throw new Error(`Could not load story file: ${inkPath}\n\nPlease make sure the file exists and the path is correct.`);
        }
        
        let inkSource = await response.text();
        
        // Resolve all INCLUDE statements
        inkSource = await resolveIncludes(inkSource, basePath);
        
        if (import.meta.env.DEV) {
            console.log(`📝 Resolved ${inkSource.length} characters of story content`);
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
                const errorDetails = compiler.errors.map((err, i) => `  ${i + 1}. ${err}`).join('\n');
                throw new Error(`Story has compilation errors:\n\n${errorDetails}\n\nPlease fix these issues in your .ink file.`);
            }
            // If no specific errors, rethrow the original error
            throw new Error(`Story compilation failed: ${compileError.message}`);
        }
        
        // Log warnings in development mode only (they don't prevent the story from working)
        if (compiler.warnings && compiler.warnings.length > 0 && import.meta.env.DEV) {
            console.info(`📝 Story compiled with ${compiler.warnings.length} warning(s):`, compiler.warnings);
        }
        
        const jsonOutput = compiledStory.ToJson();
        
        if (import.meta.env.DEV) {
            console.log(`✅ Story compiled successfully: ${jsonOutput.length} characters`);
        }
        
        return jsonOutput;
    } catch (error) {
        // Provide helpful error message to users
        const userMessage = error.message || 'An unknown error occurred';
        console.error(`❌ Error loading story from ${inkPath}:`, error);
        throw new Error(userMessage);
    }
}
