import React from 'react';

// PUBLIC_INTERFACE
function NavigationHeader() {
  /**
   * Top navigation header component matching Arena11 design specs.
   * Features brand logo, navigation items, and user profile actions.
   */
  
  const navigationItems = [
    { label: 'Dashboard', active: true, icon: '📊' },
    { label: 'Live Matches', active: false, icon: '⚽' },
    { label: 'Analytics', active: false, icon: '📈' },
    { label: 'Settings', active: false, icon: '⚙️' }
  ];

  return (
    <header className="navigation-header">
      <div className="nav-brand">
        <div className="brand-logo">
          <span className="brand-icon">⚡</span>
          <span className="brand-text">Arena11</span>
        </div>
      </div>
      
      <nav className="nav-menu">
        {navigationItems.map((item, index) => (
          <button
            key={index}
            className={`nav-item ${item.active ? 'active' : ''}`}
            aria-current={item.active ? 'page' : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="nav-actions">
        <button className="nav-action-btn" aria-label="Notifications">
          <span>🔔</span>
        </button>
        <button className="nav-action-btn" aria-label="User Profile">
          <span>👤</span>
        </button>
      </div>
    </header>
  );
}

export default NavigationHeader;
