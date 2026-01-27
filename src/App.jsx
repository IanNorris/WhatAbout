import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Hub from './components/Hub';
import TopicView from './components/TopicView';
import { parseHash, navigateToHub, navigateToStory } from './utils/routing';
import { loadStoryList, loadInkStory } from './stories';

const App = () => {
  // Story stack: each item has { view, story, parentStoryTitle, storyState }
  const [navStack, setNavStack] = useState([{ view: 'hub' }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentStackItem = navStack[navStack.length - 1];
  const currentView = currentStackItem.view;

  // Initialize from URL on mount
  useEffect(() => {
    const initializeFromURL = async () => {
      const route = parseHash();
      
      if (route.type === 'story') {
        try {
          // Load story list to find the story metadata
          const storyList = await loadStoryList();
          const storyMetadata = storyList.find(s => s.id === route.storyId);
          
          if (!storyMetadata) {
            setError(`Story "${route.storyId}" not found`);
            navigateToHub();
            setLoading(false);
            return;
          }
          
          // Load the story content
          const compiledStory = await loadInkStory(storyMetadata.inkPath);
          
          // Set nav stack to the story
          setNavStack([{
            view: 'topic',
            story: {
              ...storyMetadata,
              content: compiledStory
            },
            parentStoryTitle: null,
            storyState: null
          }]);
        } catch (err) {
          setError(`Failed to load story: ${err.message}`);
          navigateToHub();
        }
      }
      
      setLoading(false);
    };
    
    initializeFromURL();
  }, []);

  // Listen for hash changes (browser back/forward)
  useEffect(() => {
    const handleHashChange = async () => {
      const route = parseHash();
      
      if (route.type === 'hub') {
        // Navigate back to hub
        setNavStack([{ view: 'hub' }]);
      } else if (route.type === 'story') {
        // Check if we're already on this story
        if (currentStackItem.view === 'topic' && currentStackItem.story?.id === route.storyId) {
          return; // Already on this story
        }
        
        // Load the new story
        try {
          const storyList = await loadStoryList();
          const storyMetadata = storyList.find(s => s.id === route.storyId);
          
          if (!storyMetadata) {
            setError(`Story "${route.storyId}" not found`);
            navigateToHub();
            return;
          }
          
          const compiledStory = await loadInkStory(storyMetadata.inkPath);
          
          setNavStack([{
            view: 'topic',
            story: {
              ...storyMetadata,
              content: compiledStory
            },
            parentStoryTitle: null,
            storyState: null
          }]);
        } catch (err) {
          setError(`Failed to load story: ${err.message}`);
        }
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentStackItem]);

  const navigateToTopic = (story, savedState = null) => {
    // Update URL
    navigateToStory(story.id);
    
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
      const newStack = prev.slice(0, -1);
      
      // Update URL based on new stack top
      const newTop = newStack[newStack.length - 1];
      if (newTop.view === 'hub') {
        navigateToHub();
      } else if (newTop.view === 'topic') {
        navigateToStory(newTop.story.id);
      }
      
      return newStack;
    });
  };

  const returnToHub = () => {
    navigateToHub();
    setNavStack([{ view: 'hub' }]);
  };

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="page-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '50vh'
        }}>
          <p style={{ color: 'var(--color-accent)', fontSize: '1.2rem' }}>Loading...</p>
        </div>
      </Layout>
    );
  }

  // Show error if any
  if (error) {
    return (
      <Layout>
        <div className="page-container" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '50vh',
          gap: '1rem'
        }}>
          <p style={{ color: '#f4a261', fontSize: '1.2rem' }}>⚠️ {error}</p>
          <button 
            onClick={returnToHub}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: 'var(--color-accent)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Go to Hub
          </button>
        </div>
      </Layout>
    );
  }

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
