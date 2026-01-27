import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Story Syntax Validation', () => {
  const storiesDir = path.join(__dirname, '../../public/stories');
  
  it('should not have ** markdown syntax (use __ instead)', () => {
    const problematicFiles = [];
    
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
          // Check for ** at start of line (definitely problematic)
          if (/^\*\*[^*]/.test(line.trim())) {
            problematicFiles.push({
              file: `${storyDir}/${inkFile}`,
              line: index + 1,
              content: line.trim(),
              issue: '** at start of line - Ink interprets as choice'
            });
          }
          
          // Check for **text** pattern anywhere (potentially problematic)
          const doubleAsteriskMatches = line.match(/\*\*[^*\s][^*]*\*\*/g);
          if (doubleAsteriskMatches) {
            problematicFiles.push({
              file: `${storyDir}/${inkFile}`,
              line: index + 1,
              content: line.trim(),
              matches: doubleAsteriskMatches,
              issue: '** markdown syntax - may cause issues with Ink parser'
            });
          }
        });
      }
    }
    
    if (problematicFiles.length > 0) {
      console.log('\n⚠️  Found ** markdown syntax in stories:\n');
      
      // Group by file
      const byFile = {};
      problematicFiles.forEach(p => {
        if (!byFile[p.file]) byFile[p.file] = [];
        byFile[p.file].push(p);
      });
      
      Object.entries(byFile).forEach(([file, issues]) => {
        console.log(`\n${file}:`);
        issues.forEach(issue => {
          console.log(`  Line ${issue.line}: ${issue.content.substring(0, 60)}...`);
          if (issue.matches) {
            console.log(`    Matches: ${issue.matches.join(', ')}`);
          }
        });
      });
      
      console.log('\n💡 Solution: Replace ** with __ for markdown bold');
      console.log('   Example: **text** → __text__\n');
      
      expect(problematicFiles.length).toBe(0);
    }
  });
  
  it('should use __ for markdown bold (safe alternative)', () => {
    const storiesDir = path.join(__dirname, '../../public/stories');
    let hasUnderscoreBold = false;
    
    // Get all story directories
    const storyDirs = fs.readdirSync(storiesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    for (const storyDir of storyDirs) {
      const storyPath = path.join(storiesDir, storyDir);
      const inkFiles = fs.readdirSync(storyPath)
        .filter(file => file.endsWith('.ink'));
      
      for (const inkFile of inkFiles) {
        const filePath = path.join(storyPath, inkFile);
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (/__[^_\s][^_]*__/.test(content)) {
          hasUnderscoreBold = true;
          break;
        }
      }
      if (hasUnderscoreBold) break;
    }
    
    // This test just documents the correct pattern
    // It's informational, not a strict requirement
    if (hasUnderscoreBold) {
      console.log('✓ Some stories are using __ for markdown bold (good!)');
    }
  });
});
