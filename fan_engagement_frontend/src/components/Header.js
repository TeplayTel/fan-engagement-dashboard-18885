import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
function Header() {
  /**
   * Enhanced header component displaying match details with live updates.
   */
  const [matchTime, setMatchTime] = useState('88\'');
  const [viewerCount, setViewerCount] = useState(2147);
  
  // Simulate live match time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMatchTime(prev => {
        const time = parseInt(prev);
        return time < 90 ? `${time + 1}'` : `${time + Math.floor(Math.random() * 5)}'`;
      });
      
      // Simulate viewer count fluctuation
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 20) - 10;
        return Math.max(1000, prev + change);
      });
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const formatViewerCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <header className="dashboard-header">
      <div className="match-details">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <h1>Arsenal vs Chelsea</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <span className="live-indicator">
              LIVE
            </span>
            <div style={{
              background: 'var(--glass-background)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-xs) var(--space-sm)',
              color: 'var(--primary-text)',
              fontSize: '0.875rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-xs)'
            }}>
              <span>⏱️</span>
              <span>{matchTime}</span>
            </div>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-lg)',
          marginTop: 'var(--space-sm)',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            color: 'var(--secondary-text)',
            fontSize: '0.875rem'
          }}>
            <span>👥</span>
            <span>{formatViewerCount(viewerCount)} watching</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            color: 'var(--secondary-text)',
            fontSize: '0.875rem'
          }}>
            <span>🏟️</span>
            <span>Emirates Stadium</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            color: 'var(--secondary-text)',
            fontSize: '0.875rem'
          }}>
            <span>📺</span>
            <span>Premier League</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
