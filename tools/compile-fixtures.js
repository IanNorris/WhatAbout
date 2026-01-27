import { Compiler } from 'inkjs/compiler/Compiler';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixtures = ['simple', 'choices', 'loop', 'knots', 'position-tracking'];
const fixturesDir = path.join(__dirname, '../src/test/fixtures');

for (const fixture of fixtures) {
  const inkPath = path.join(fixturesDir, fixture + '.ink');
  const jsonPath = path.join(fixturesDir, fixture + '.json');
  
  const inkSource = fs.readFileSync(inkPath, 'utf8');
  const compiler = new Compiler(inkSource);
  const compiled = compiler.Compile();
  
  if (compiler.errors && compiler.errors.length > 0) {
    console.error(`Errors in ${fixture}:`, compiler.errors);
    continue;
  }
  
  const json = compiled.ToJson();
  fs.writeFileSync(jsonPath, json, 'utf8');
  console.log(`Compiled ${fixture}.ink to ${fixture}.json`);
}

console.log('All fixtures compiled successfully!');
