import React from 'react';

// PUBLIC_INTERFACE
function CurrentMatchDisplay({ match, onMatchSelect }) {
  /**
   * Displays the currently playing match in a single horizontal "Who vs Who" tabular row.
   * @param {object} match - The currently active match data
   * @param {function} onMatchSelect - Callback when match is clicked (optional, for consistency)
   */
  
  if (!match) {
    return (
      <div className="current-match-display loading">
        <div className="current-match-content">
          <div className="loading-placeholder">
            <span>Loading current match...</span>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status, time) => {
    const badgeStyles = {
      live: { 
        background: 'linear-gradient(135deg, var(--accent-red) 0%, #FF6B7A 100%)', 
        color: 'white',
        animation: 'pulse-glow 2s ease-in-out infinite alternate'
      },
      halftime: { 
        background: 'linear-gradient(135deg, var(--accent-orange) 0%, #FFB347 100%)', 
        color: 'white' 
      },
      finished: { 
        background: 'var(--tertiary-background)', 
        color: 'var(--secondary-text)' 
      },
      upcoming: { 
        background: 'var(--accent-blue)', 
        color: 'white' 
      }
    };

    const style = badgeStyles[status] || badgeStyles.upcoming;

    return (
      <span style={{
        ...style,
        padding: 'var(--space-xs) var(--space-md)',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.875rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-xs)',
        boxShadow: 'var(--shadow-md)',
        whiteSpace: 'nowrap'
      }}>
        {status === 'live' && <span style={{ fontSize: '0.7rem' }}>🔴</span>}
        {status === 'halftime' ? 'HALF TIME' : status === 'live' ? `LIVE ${time}` : status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="current-match-display">
      <div className="current-match-content">
        {/* League and Status Header */}
        <div className="current-match-header">
          <div className="league-info">
            <span className="league-icon">🏆</span>
            <span className="league-name">{match.league}</span>
          </div>
          <div className="match-status">
            {getStatusBadge(match.status, match.time)}
          </div>
        </div>

        {/* Main Match Display - Who vs Who */}
        <div className="who-vs-who-container">
          {/* Home Team */}
          <div className="team-section home-team">
            <div className="team-logo-container">
              {match.home.logo ? (
                <img 
                  src={match.home.logo} 
                  alt={`${match.home.name} logo`}
                  className="team-logo"
                />
              ) : (
                <div className="team-logo-fallback">
                  {match.home.name.slice(0, 3).toUpperCase()}
                </div>
              )}
            </div>
            <div className="team-info">
              <h2 className="team-name">{match.home.name}</h2>
              <span className="team-designation">HOME</span>
            </div>
          </div>

          {/* VS Section with Score */}
          <div className="vs-section">
            <div className="score-display">
              <span className="score-text">{match.score}</span>
            </div>
            <div className="vs-text">VS</div>
            {match.status === 'live' && (
              <div className="match-time">
                <span className="time-icon">⏱️</span>
                <span className="time-text">{match.time}</span>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="team-section away-team">
            <div className="team-info">
              <h2 className="team-name">{match.away.name}</h2>
              <span className="team-designation">AWAY</span>
            </div>
            <div className="team-logo-container">
              {match.away.logo ? (
                <img 
                  src={match.away.logo} 
                  alt={`${match.away.name} logo`}
                  className="team-logo"
                />
              ) : (
                <div className="team-logo-fallback">
                  {match.away.name.slice(0, 3).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Match Stats Footer */}
        <div className="current-match-footer">
          <div className="match-stat">
            <span className="stat-icon">👥</span>
            <span className="stat-text">{(Math.floor(Math.random() * 500) + 100 * 10)} watching</span>
          </div>
          <div className="match-stat">
            <span className="stat-icon">🎯</span>
            <span className="stat-text">{(Math.floor(Math.random() * 1000) + 200 * 5)} reactions</span>
          </div>
          <div className="match-stat">
            <span className="stat-icon">🏟️</span>
            <span className="stat-text">Emirates Stadium</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentMatchDisplay;
