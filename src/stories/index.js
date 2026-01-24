import demoStory from './demo.json';
import ageVerificationStory from './age_verification.json';

export const stories = [
    {
        id: 'age-verification',
        title: 'Age Verification',
        description: 'Should we verify age online? The pros, cons, and tech reality.',
        content: ageVerificationStory
    },
    {
        id: 'demo',
        title: 'Demo Story',
        description: 'A test of the cloud system.',
        content: demoStory
    }
];
