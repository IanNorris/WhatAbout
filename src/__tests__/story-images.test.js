import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Story Image Validation', () => {
  it('should have all referenced images present', () => {
    const storiesDir = path.join(__dirname, '../../public/stories');
    const assetsDir = path.join(__dirname, '../../public/assets');
    const missingImages = [];
    const foundImages = [];
    
    // Get all story directories
    const storyDirs = fs.readdirSync(storiesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    for (const storyDir of storyDirs) {
      const storyPath = path.join(storiesDir, storyDir);
      
      // Get all .ink files
      const inkFiles = fs.readdirSync(storyPath)
        .filter(file => file.endsWith('.ink'));
      
      for (const inkFile of inkFiles) {
        const filePath = path.join(storyPath, inkFile);
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // Find diagram references: # diagram: filename.png
          const diagramMatch = line.match(/#\s*diagram:\s*([^\s]+\.(?:png|jpg|jpeg|gif|svg))/i);
          if (diagramMatch) {
            const imageFile = diagramMatch[1];
            const imagePathInAssets = path.join(assetsDir, storyDir, imageFile);
            const imagePathInStory = path.join(storyPath, imageFile);
            
            // Check both locations
            const existsInAssets = fs.existsSync(imagePathInAssets);
            const existsInStory = fs.existsSync(imagePathInStory);
            
            if (existsInAssets || existsInStory) {
              foundImages.push({
                story: storyDir,
                file: inkFile,
                line: index + 1,
                image: imageFile,
                location: existsInAssets ? 'assets' : 'story'
              });
            } else {
              missingImages.push({
                story: storyDir,
                file: inkFile,
                line: index + 1,
                image: imageFile,
                expectedPaths: [
                  `public/assets/${storyDir}/${imageFile}`,
                  `public/stories/${storyDir}/${imageFile}`
                ]
              });
            }
          }
          
          // Also check for markdown image syntax: ![alt](image.png)
          const mdImageMatches = line.matchAll(/!\[([^\]]*)\]\(([^)]+\.(?:png|jpg|jpeg|gif|svg))\)/gi);
          for (const match of mdImageMatches) {
            const imageFile = match[2];
            const imagePathInAssets = path.join(assetsDir, storyDir, imageFile);
            const imagePathInStory = path.join(storyPath, imageFile);
            
            const existsInAssets = fs.existsSync(imagePathInAssets);
            const existsInStory = fs.existsSync(imagePathInStory);
            
            if (!existsInAssets && !existsInStory) {
              missingImages.push({
                story: storyDir,
                file: inkFile,
                line: index + 1,
                image: imageFile,
                syntax: 'markdown',
                expectedPaths: [
                  `public/assets/${storyDir}/${imageFile}`,
                  `public/stories/${storyDir}/${imageFile}`
                ]
              });
            }
          }
        });
      }
    }
    
    // Report results
    console.log(`\n=== Image Reference Scan ===`);
    console.log(`Total image references found: ${foundImages.length + missingImages.length}`);
    console.log(`Images found: ${foundImages.length}`);
    console.log(`Images missing: ${missingImages.length}\n`);
    
    if (foundImages.length > 0) {
      console.log('✅ Found images by story:');
      const byStory = {};
      foundImages.forEach(img => {
        if (!byStory[img.story]) byStory[img.story] = [];
        byStory[img.story].push(img);
      });
      
      Object.entries(byStory).forEach(([story, images]) => {
        console.log(`  ${story}: ${images.length} images`);
      });
    }
    
    if (missingImages.length > 0) {
      console.log('\n❌ Missing images:\n');
      
      missingImages.forEach(missing => {
        console.log(`${missing.story}/${missing.file}:${missing.line}`);
        console.log(`  Referenced: ${missing.image}`);
        console.log(`  Expected locations:`);
        missing.expectedPaths.forEach(p => console.log(`    - ${p}`));
        console.log('');
      });
      
      expect(missingImages.length, 
        `Found ${missingImages.length} missing image(s). Add these images or remove the references.`
      ).toBe(0);
    } else {
      console.log('\n✅ All referenced images are present!');
    }
  });
});
