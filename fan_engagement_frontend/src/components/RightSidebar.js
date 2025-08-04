import React, { useState, useEffect } from 'react';
import Analytics from './Analytics';

// PUBLIC_INTERFACE  
function RightSidebar({ currentMatch }) {
  /**
   * Right sidebar component displaying player statistics, team information, and live data.
   * Features collapsible sections and scrollable content as per design specs.
   */
  
  const [playerStats, setPlayerStats] = useState([]);
  const [teamStats, setTeamStats] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    players: true,
    teamStats: true,
    analytics: true
  });

  useEffect(() => {
    if (currentMatch) {
      generatePlayerStats();
      generateTeamStats();
    }
  }, [currentMatch]);

  const generatePlayerStats = () => {
    const players = [
      { id: 1, name: 'Kevin De Bruyne', position: 'MID', rating: 8.7, goals: 1, assists: 2, passes: 89 },
      { id: 2, name: 'Erling Haaland', position: 'FWD', rating: 9.2, goals: 2, assists: 0, passes: 23 },
      { id: 3, name: 'Virgil van Dijk', position: 'DEF', rating: 8.1, goals: 0, assists: 0, passes: 67 },
      { id: 4, name: 'Alisson Becker', position: 'GK', rating: 7.8, goals: 0, assists: 0, passes: 34 },
      { id: 5, name: 'Mohamed Salah', position: 'FWD', rating: 8.5, goals: 1, assists: 1, passes: 42 }
    ];
    setPlayerStats(players);
  };

  const generateTeamStats = () => {
    if (!currentMatch) return;
    
    setTeamStats({
      possession: { home: 58, away: 42 },
      shots: { home: 12, away: 8 },
      shotsOnTarget: { home: 6, away: 3 },
      corners: { home: 7, away: 4 },
      fouls: { home: 9, away: 11 },
      yellowCards: { home: 2, away: 3 },
      redCards: { home: 0, away: 0 }
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getPositionColor = (position) => {
    const colors = {
      'GK': '#ff9900',
      'DEF': '#0066ff', 
      'MID': '#00cc66',
      'FWD': '#ff3333'
    };
    return colors[position] || '#cccccc';
  };

  const getRatingColor = (rating) => {
    if (rating >= 9) return '#00cc66';
    if (rating >= 8) return '#66cc00';
    if (rating >= 7) return '#ff9900';
    return '#ff3333';
  };

  return (
    <div className="right-sidebar">
      {/* Player Statistics Section */}
      <div className="sidebar-section">
        <div 
          className="section-header"
          onClick={() => toggleSection('players')}
        >
          <h3>
            <span className="section-icon">👥</span>
            Player Stats
          </h3>
          <button className="section-toggle">
            {expandedSections.players ? '▼' : '▶'}
          </button>
        </div>
        
        {expandedSections.players && (
          <div className="section-content">
            <div className="player-list">
              {playerStats.map(player => (
                <div key={player.id} className="player-card">
                  <div className="player-header">
                    <div className="player-info">
                      <div className="player-name">{player.name}</div>
                      <div 
                        className="player-position"
                        style={{ 
                          backgroundColor: getPositionColor(player.position),
                          color: 'white'
                        }}
                      >
                        {player.position}
                      </div>
                    </div>
                    <div 
                      className="player-rating"
                      style={{ color: getRatingColor(player.rating) }}
                    >
                      {player.rating}
                    </div>
                  </div>
                  
                  <div className="player-stats">
                    <div className="stat-item">
                      <span className="stat-icon">⚽</span>
                      <span className="stat-value">{player.goals}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">🎯</span>
                      <span className="stat-value">{player.assists}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">📊</span>
                      <span className="stat-value">{player.passes}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Team Statistics Section */}
      <div className="sidebar-section">
        <div 
          className="section-header"
          onClick={() => toggleSection('teamStats')}
        >
          <h3>
            <span className="section-icon">📊</span>
            Match Stats
          </h3>
          <button className="section-toggle">
            {expandedSections.teamStats ? '▼' : '▶'}
          </button>
        </div>
        
        {expandedSections.teamStats && (
          <div className="section-content">
            <div className="team-stats-grid">
              {Object.entries(teamStats).map(([statName, values]) => (
                <div key={statName} className="team-stat-row">
                  <div className="stat-home">{values.home}</div>
                  <div className="stat-name">
                    {statName.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </div>
                  <div className="stat-away">{values.away}</div>
                  
                  {/* Progress bar for possession */}
                  {statName === 'possession' && (
                    <div className="possession-bar">
                      <div 
                        className="possession-fill home"
                        style={{ width: `${values.home}%` }}
                      ></div>
                      <div 
                        className="possession-fill away"
                        style={{ width: `${values.away}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Indicators Section */}
      <div className="sidebar-section">
        <div className="section-header">
          <h3>
            <span className="section-icon">🔴</span>
            Live Data
          </h3>
          <div className="live-status">
            <div className="live-dot"></div>
            <span>UPDATING</span>
          </div>
        </div>
        
        <div className="section-content">
          <div className="live-indicators">
            <div className="live-indicator-item">
              <span className="indicator-label">Match Status</span>
              <span className="indicator-value">
                {currentMatch?.status === 'live' ? '🟢 Live' : '🔴 Ended'}
              </span>
            </div>
            <div className="live-indicator-item">
              <span className="indicator-label">Viewers</span>
              <span className="indicator-value">2.1K watching</span>
            </div>
            <div className="live-indicator-item">
              <span className="indicator-label">Reactions</span>
              <span className="indicator-value">1.2K sent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Integration */}
      <div className="sidebar-section">
        <div 
          className="section-header"
          onClick={() => toggleSection('analytics')}
        >
          <h3>
            <span className="section-icon">📈</span>
            Analytics
          </h3>
          <button className="section-toggle">
            {expandedSections.analytics ? '▼' : '▶'}
          </button>
        </div>
        
        {expandedSections.analytics && (
          <div className="section-content">
            <Analytics currentMatch={currentMatch} compact={true} />
          </div>
        )}
      </div>
    </div>
  );
}

export default RightSidebar;
