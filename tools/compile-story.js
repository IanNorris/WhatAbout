import { Compiler } from 'inkjs/compiler/Compiler';
import { PosixFileHandler } from 'inkjs/compiler/FileHandler/PosixFileHandler';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storyPath = process.argv[2];
if (!storyPath) {
  console.error('Usage: node compile-story.js <path-to-ink-file>');
  process.exit(1);
}

const inkSource = fs.readFileSync(storyPath, 'utf8');
const storyDir = path.dirname(path.resolve(storyPath));

// Create file handler for INCLUDE resolution
const fileHandler = new PosixFileHandler(storyDir);

const compiler = new Compiler(inkSource, {
  fileHandler: fileHandler,
  errorHandler: (message, errorType) => {
    if (errorType === 0) { // Warning
      if (!compiler.warnings) compiler.warnings = [];
      compiler.warnings.push(message);
    } else { // Error
      if (!compiler.errors) compiler.errors = [];
      compiler.errors.push(message);
    }
  }
});

const story = compiler.Compile();

if (compiler.errors && compiler.errors.length > 0) {
  // Filter out warnings, only treat actual errors as errors
  const actualErrors = compiler.errors.filter(err => !err.startsWith('WARNING:'));
  if (actualErrors.length > 0) {
    console.error('Compilation errors:');
    actualErrors.forEach(err => console.error('  -', err));
    process.exit(1);
  }
}

if (compiler.warnings && compiler.warnings.length > 0) {
  console.warn(`Warnings (${compiler.warnings.length}):`) ;
  compiler.warnings.slice(0, 5).forEach(warn => console.warn('  -', warn));
  if (compiler.warnings.length > 5) {
    console.warn(`  ... and ${compiler.warnings.length - 5} more warnings`);
  }
}

const jsonPath = storyPath.replace('.ink', '.json');
fs.writeFileSync(jsonPath, story.ToJson());
console.log(`✓ Compiled: ${path.basename(storyPath)} → ${path.basename(jsonPath)}`);
