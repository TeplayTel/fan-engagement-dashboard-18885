import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('dark'); // Default to dark theme
  const [activeTab, setActiveTab] = useState('viewer'); // 'viewer' or 'admin'

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  // The toggle functionality can be removed if not needed, but we'll leave it for now.
  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };


  return (
    <div className="App">
       <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      
      <nav className="app-nav">
        <button 
          className={`nav-tab ${activeTab === 'viewer' ? 'active' : ''}`}
          onClick={() => setActiveTab('viewer')}
        >
          Viewer
        </button>
        <button 
          className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          Admin
        </button>
      </nav>

      {activeTab === 'viewer' ? <Dashboard /> : <AdminDashboard />}
    </div>
  );
}

export default App;
