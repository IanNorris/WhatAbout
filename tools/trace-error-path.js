/* eslint-disable no-unused-vars */
import { Story } from 'inkjs/engine/Story';
import fs from 'fs';

const storyJson = fs.readFileSync('public/stories/social-media-bans/main.json', 'utf8');
const story = new Story(storyJson);

// Add error handler
story.onError = (message, type) => {
  console.error(`\n🚨 ERROR: ${message}`);
};

// External function mocks
story.BindExternalFunction('navigateTo', (storyId) => {
  console.log(`\n→ navigateTo("${storyId}")`);
});
story.BindExternalFunction('exit', () => {
  console.log('\n→ exit()');
});

// The failing path based on test output
const choiceTexts = [
  "That sounds reasonable.",
  "So we ban VPNs then.",
  "I'll take your word for it. What happens when kids bypass the ban?",
  "Why would parents help them bypass it?",
  "But they're breaking the law!"
];

console.log('=== Tracing Error Path ===\n');

let stepNum = 0;
for (const targetChoiceText of choiceTexts) {
  // Continue story
  while (story.canContinue) {
    const text = story.Continue();
    if (text.trim()) {
      console.log(`[Text] ${text.trim().substring(0, 100)}${text.length > 100 ? '...' : ''}`);
    }
  }

  // Find and select choice
  const choices = story.currentChoices;
  if (choices.length === 0) {
    console.error(`\n❌ No choices available after step ${stepNum}!`);
    break;
  }

  console.log(`\nAvailable choices (${choices.length}):`);
  choices.forEach((c, i) => {
    console.log(`  [${i}] ${c.text}`);
  });

  const choiceIndex = choices.findIndex(c => c.text.includes(targetChoiceText.substring(0, 30)));
  if (choiceIndex === -1) {
    console.error(`\n❌ Could not find choice: "${targetChoiceText}"`);
    break;
  }

  console.log(`\n→ Choosing [${choiceIndex}]: ${choices[choiceIndex].text}`);
  story.ChooseChoiceIndex(choiceIndex);
  stepNum++;
}

// After last choice, continue
console.log('\n=== After Last Choice ===');
let continueCount = 0;
while (story.canContinue && continueCount < 20) {
  const text = story.Continue();
  if (text.trim()) {
    console.log(`[Text ${continueCount}] ${text.trim()}`);
  }
  continueCount++;
}

console.log(`\n=== Final State ===`);
console.log(`canContinue: ${story.canContinue}`);
console.log(`Choices available: ${story.currentChoices.length}`);
if (story.currentChoices.length > 0) {
  story.currentChoices.forEach((c, i) => {
    console.log(`  [${i}] ${c.text}`);
  });
} else {
  console.log('  (none - this is the problem!)');
}
