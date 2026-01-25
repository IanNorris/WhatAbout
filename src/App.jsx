import React, { useState } from 'react';
import Layout from './components/Layout';
import Hub from './components/Hub';
import TopicView from './components/TopicView';

const App = () => {
  // Story stack: each item has { view, story, parentStoryTitle, storyState }
  const [navStack, setNavStack] = useState([{ view: 'hub' }]);
  const currentStackItem = navStack[navStack.length - 1];
  const currentView = currentStackItem.view;

  const navigateToTopic = (story, savedState = null) => {
    // If we're currently in a topic, use its title as parent
    const currentParentTitle = currentStackItem.view === 'topic' 
      ? currentStackItem.story.title 
      : null;
    
    setNavStack(prev => [...prev, { 
      view: 'topic', 
      story,
      parentStoryTitle: story.parentStoryTitle || currentParentTitle,
      storyState: savedState // Store any saved state
    }]);
  };

  const saveStateAndNavigate = (storyState, newStory) => {
    // Save current story's state
    setNavStack(prev => {
      const newStack = [...prev];
      newStack[newStack.length - 1] = {
        ...newStack[newStack.length - 1],
        storyState: storyState
      };
      return newStack;
    });
    
    // Then navigate to new story
    navigateToTopic(newStory);
  };

  const traverseBack = () => {
    setNavStack(prev => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  };

  const returnToHub = () => {
    setNavStack([{ view: 'hub' }]);
  };

  return (
    <Layout>
      {currentView === 'hub' && (
        <div className="page-container">
          <Hub onSelectTopic={navigateToTopic} />
        </div>
      )}

      {currentView === 'topic' && (
        <div className="page-container">
          <TopicView
            storyContent={currentStackItem.story.content}
            storyId={currentStackItem.story.id}
            storyTitle={currentStackItem.story.title}
            parentStoryTitle={currentStackItem.parentStoryTitle}
            savedState={currentStackItem.storyState}
            onClose={traverseBack}
            onHome={returnToHub}
            onNavigateToStory={saveStateAndNavigate}
          />
        </div>
      )}
    </Layout>
  );
}

export default App;
