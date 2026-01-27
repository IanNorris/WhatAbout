import { discoverAllPaths } from '../src/test/pathDiscovery.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loopStory = fs.readFileSync(path.join(__dirname, '../src/test/fixtures/loop.json'), 'utf8');

(async () => {
  const result = await discoverAllPaths(loopStory, {
    stateHashLimit: 2,
    maxDepth: 20,
  });

  console.log('Total paths:', result.paths.length);
  console.log('Completed paths:', result.stats.completedPaths);
  console.log('Loops detected:', result.stats.loopsDetected);
  console.log('Max depth reached:', result.stats.maxDepthReached);
  
  console.log('\nPaths:');
  result.paths.forEach((p, i) => {
    console.log(`  ${i}: choices=[${p.choices.join(', ')}], endReason=${p.endReason}, completed=${p.completed}`);
  });
})();
