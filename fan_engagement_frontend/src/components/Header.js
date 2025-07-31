import React from 'react';

// PUBLIC_INTERFACE
function Header() {
  /**
   * Header component displaying match details.
   */
  return (
    <header className="dashboard-header">
      <div className="match-details">
        <h1>Arsenal vs Chelsea</h1>
        <span className="live-indicator">LIVE</span>
      </div>
    </header>
  );
}

export default Header;
