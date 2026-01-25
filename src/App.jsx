import React, { useState } from 'react';
import Layout from './components/Layout';
import Hub from './components/Hub';
import TopicView from './components/TopicView';

const App = () => {
  // Navigation Stack now stores objects? Or just IDs? 
  // Let's store view state: { name: 'hub' } or { name: 'topic', story: ... }
  // To keep it simple with the stack: Stack items are objects { view: 'hub' }

  const [navStack, setNavStack] = useState([{ view: 'hub' }]);
  const currentStackItem = navStack[navStack.length - 1];
  const currentView = currentStackItem.view;

  const navigateToTopic = (story) => {
    setNavStack(prev => [...prev, { view: 'topic', story }]);
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
            onClose={traverseBack}
            onHome={returnToHub}
          />
        </div>
      )}
    </Layout>
  );
}

export default App;
