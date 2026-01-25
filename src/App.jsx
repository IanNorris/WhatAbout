import React, { useState } from 'react';
import Layout from './components/Layout';
import Hub from './components/Hub';
import TopicView from './components/TopicView';

const App = () => {
  // Story stack: each item has { view, story, parentStoryTitle }
  const [navStack, setNavStack] = useState([{ view: 'hub' }]);
  const currentStackItem = navStack[navStack.length - 1];
  const currentView = currentStackItem.view;

  const navigateToTopic = (story) => {
    // If we're currently in a topic, use its title as parent
    const currentParentTitle = currentStackItem.view === 'topic' 
      ? currentStackItem.story.title 
      : null;
    
    setNavStack(prev => [...prev, { 
      view: 'topic', 
      story,
      parentStoryTitle: story.parentStoryTitle || currentParentTitle
    }]);
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
            onClose={traverseBack}
            onHome={returnToHub}
            onNavigateToStory={navigateToTopic}
          />
        </div>
      )}
    </Layout>
  );
}

export default App;
