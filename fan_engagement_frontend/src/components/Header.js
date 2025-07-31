import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
function Header({ currentMatch }) {
  /**
   * Enhanced header component displaying current match details with live updates.
   * Now dynamically updates based on the currently selected match.
   * @param {object} currentMatch - The currently active match object
   */
  const [matchTime, setMatchTime] = useState('88\'');
  const [viewerCount, setViewerCount] = useState(2147);
  const [matchTitle, setMatchTitle] = useState('Loading Match...');
  const [league, setLeague] = useState('');
  const [status, setStatus] = useState('live');
  
  // Update header when current match changes
  useEffect(() => {
    if (currentMatch) {
      setMatchTitle(`${currentMatch.home.name} vs ${currentMatch.away.name}`);
      setLeague(currentMatch.league);
      setStatus(currentMatch.status);
      setMatchTime(currentMatch.time);
    }
  }, [currentMatch]);

  // Listen for match change events from Dashboard
  useEffect(() => {
    const handleMatchChange = (event) => {
      const { matchTitle: newTitle, league: newLeague, time, status: newStatus } = event.detail;
      setMatchTitle(newTitle);
      setLeague(newLeague);
      setMatchTime(time);
      setStatus(newStatus);
    };

    window.addEventListener('matchChanged', handleMatchChange);
    return () => window.removeEventListener('matchChanged', handleMatchChange);
  }, []);
  
  // Simulate live match time updates (only for live matches)
  useEffect(() => {
    if (status !== 'live') return;

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
  }, [status]);

  const formatViewerCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getStatusDisplay = () => {
    const statusConfig = {
      live: { text: 'LIVE', color: 'var(--accent-red)', showTime: true },
      halftime: { text: 'HALF TIME', color: 'var(--accent-orange)', showTime: false },
      finished: { text: 'FULL TIME', color: 'var(--secondary-text)', showTime: false },
      upcoming: { text: 'UPCOMING', color: 'var(--accent-blue)', showTime: false }
    };

    const config = statusConfig[status] || statusConfig.live;
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <span 
          className="live-indicator"
          style={{
            background: status === 'live' ? 
              'linear-gradient(135deg, var(--accent-red) 0%, #FF6B7A 100%)' : 
              config.color,
            animation: status === 'live' ? 'pulse-glow 2s ease-in-out infinite alternate' : 'none'
          }}
        >
          {config.text}
        </span>
        {config.showTime && (
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
        )}
      </div>
    );
  };

  const getStadiumName = () => {
    // Map teams to their stadiums (placeholder logic)
    const stadiums = {
      'Arsenal': 'Emirates Stadium',
      'Chelsea': 'Stamford Bridge',
      'Real Madrid': 'Santiago Bernabéu',
      'Barcelona': 'Camp Nou',
      'AC Milan': 'San Siro',
      'Inter Milan': 'San Siro',
      'Bayern Munich': 'Allianz Arena',
      'Borussia Dortmund': 'Signal Iduna Park',
      'PSG': 'Parc des Princes',
      'Lyon': 'Groupama Stadium'
    };

    if (currentMatch) {
      return stadiums[currentMatch.home.name] || 'Stadium';
    }
    return 'Stadium';
  };

  return (
    <header className="dashboard-header">
      <div className="match-details">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <h1 style={{
            margin: 0,
            transition: 'all 0.3s ease',
            opacity: currentMatch ? 1 : 0.7
          }}>
            {matchTitle}
          </h1>
          {getStatusDisplay()}
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
            <span>{getStadiumName()}</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            color: 'var(--secondary-text)',
            fontSize: '0.875rem'
          }}>
            <span>📺</span>
            <span>{league || 'Live Match'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
