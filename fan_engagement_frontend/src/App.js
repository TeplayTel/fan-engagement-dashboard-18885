import React from 'react';
import LayoutContainer from './components/LayoutContainer';
import HeaderComponent from './components/HeaderComponent';
import LeftSidebarComponent from './components/LeftSidebarComponent';
import VideoPlayerContainer from './components/VideoPlayerContainer';
import RightSidebarComponent from './components/RightSidebarComponent';
import FooterComponent from './components/FooterComponent';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  /**
   * Main application component that creates a pixel-perfect recreation
   * of the fan engagement platform UI using the exact design specifications.
   */
  return (
    <div className="App">
      <LayoutContainer
        headerContent={<HeaderComponent />}
        leftSidebarContent={<LeftSidebarComponent />}
        mainContent={<VideoPlayerContainer />}
        rightSidebarContent={<RightSidebarComponent />}
        footerContent={<FooterComponent />}
      />
    </div>
  );
}

export default App;
