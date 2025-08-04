import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('dark'); // Default to dark theme
  const [activeTab, setActiveTab] = useState('viewer'); // 'viewer' or 'admin'
  const [isLoading, setIsLoading] = useState(true);
  const [tabTransition, setTabTransition] = useState(false);

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

  // Enhanced tab switching with transition
  const handleTabSwitch = (tab) => {
    if (tab !== activeTab) {
      setTabTransition(true);
      setTimeout(() => {
        setActiveTab(tab);
        setTabTransition(false);
      }, 150);
    }
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
      {/* Theme Toggle - Positioned for new layout */}
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
      
      {/* Tab Navigation - Updated for sports dashboard */}
      <nav className="app-nav">
        <button 
          className={`nav-tab ${activeTab === 'viewer' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('viewer')}
          aria-label="Switch to sports dashboard"
          title="View live matches and engage with fans"
        >
          <span style={{ marginRight: '8px' }}>⚽</span>
          Live Sports
        </button>
        <button 
          className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('admin')}
          aria-label="Switch to admin dashboard"
          title="Manage matches and view analytics"
        >
          <span style={{ marginRight: '8px' }}>📊</span>
          Admin
        </button>
      </nav>

      <div 
        className={`tab-content ${tabTransition ? 'transitioning' : ''}`}
        style={{
          opacity: tabTransition ? 0.5 : 1,
          transform: tabTransition ? 'translateY(10px)' : 'translateY(0)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          height: activeTab === 'viewer' ? '100vh' : 'auto'
        }}
      >
        {activeTab === 'viewer' ? <Dashboard /> : <AdminDashboard />}
      </div>
    </div>
  );
}

export default App;
