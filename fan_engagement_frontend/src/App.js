import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';

// PUBLIC_INTERFACE
function App() {
  /**
   * Main App component - Single Page Application for Fan Engagement
   * Removed admin functionality as per requirements to focus on fan experience
   */
  const [theme, setTheme] = useState('dark'); // Default to dark theme
  const [isLoading, setIsLoading] = useState(true);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Initial loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  if (isLoading) {
    return (
      <div className="App" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'var(--primary-text)',
          fontSize: '1.2rem',
          fontWeight: '600'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border-color)',
            borderTop: '3px solid var(--accent-blue)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          Loading Fan Engagement Dashboard...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="App fade-in">
       <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>
            {theme === 'light' ? '🌙' : '☀️'}
          </span>
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      
      {/* Single-page application - only Dashboard component */}
      <Dashboard />
    </div>
  );
}

export default App;
