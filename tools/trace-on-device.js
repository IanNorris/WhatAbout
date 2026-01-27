import { Story } from 'inkjs/engine/Story';
import fs from 'fs';

const storyJson = fs.readFileSync('public/stories/on-device-scanning/main.json', 'utf8');
const story = new Story(storyJson);

story.onError = (message, type) => {
  console.error(`\n🚨 ERROR: ${message}`);
};

story.BindExternalFunction('navigateTo', (storyId) => {
  console.log(`\n→ navigateTo("${storyId}")`);
});
story.BindExternalFunction('exit', () => {
  console.log('\n→ exit()');
});

const choiceTexts = [
  "How does this break encryption?",
  "Who does the scanning?"
];

console.log('=== Tracing on-device-scanning Error Path ===\n');

for (const targetChoiceText of choiceTexts) {
  while (story.canContinue) {
    const text = story.Continue();
    if (text.trim()) {
      console.log(`[Text] ${text.trim().substring(0, 80)}...`);
    }
  }

  const choices = story.currentChoices;
  console.log(`\nAvailable choices (${choices.length}):`);
  choices.forEach((c, i) => {
    console.log(`  [${i}] ${c.text}`);
  });

  const choiceIndex = choices.findIndex(c => c.text.includes(targetChoiceText.substring(0, 15)));
  if (choiceIndex === -1) {
    console.error(`\n❌ Could not find choice: "${targetChoiceText}"`);
    break;
  }

  console.log(`\n→ Choosing [${choiceIndex}]: ${choices[choiceIndex].text}`);
  story.ChooseChoiceIndex(choiceIndex);
}

// After choices, explore what happens
console.log('\n=== After Last Choice ===');
let continueCount = 0;
while (story.canContinue && continueCount < 10) {
  const text = story.Continue();
  if (text.trim()) {
    console.log(`[Continue ${continueCount}] ${text.trim()}`);
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
  
  // Try selecting each choice to see what happens
  console.log('\n=== Testing Each Choice ===');
  for (let i = 0; i < Math.min(3, story.currentChoices.length); i++) {
    const savedState = story.state.ToJson();
    
    console.log(`\nTrying choice [${i}]: ${story.currentChoices[i].text}`);
    try {
      story.ChooseChoiceIndex(i);
      let count = 0;
      while (story.canContinue && count < 5) {
        const text = story.Continue();
        if (text.trim()) {
          console.log(`  → ${text.trim().substring(0, 60)}...`);
        }
        count++;
      }
      console.log(`  ✓ Choice worked. Now has ${story.currentChoices.length} choices.`);
    } catch (err) {
      console.error(`  ❌ ERROR: ${err.message}`);
    }
    
    // Restore
    story.state.LoadJson(savedState);
  }
}
