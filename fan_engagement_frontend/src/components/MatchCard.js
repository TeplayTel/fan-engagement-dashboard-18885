import React from 'react';

// PUBLIC_INTERFACE
function MatchCard({ match, onClick, isActive }) {
  /**
   * Modern MatchCard component implementing the design notes specifications.
   * Features horizontal card layout with dark theme, modern typography, and visual indicators.
   * @param {object} match - The match data with status and enhanced info.
   * @param {function} onClick - Click handler for card selection
   * @param {boolean} isActive - Whether this match is currently active/selected
   */
  
  const getStatusIndicator = (status, time) => {
    const indicators = {
      live: { 
        background: '#ff0000', 
        color: '#ffffff',
        text: 'LIVE',
        dot: true,
        pulse: true
      },
      halftime: { 
        background: '#ffa502', 
        color: '#ffffff',
        text: 'HT',
        dot: false,
        pulse: false
      },
      finished: { 
        background: '#404040', 
        color: '#cccccc',
        text: 'FT',
        dot: false,
        pulse: false
      },
      upcoming: { 
        background: '#3742fa', 
        color: '#ffffff',
        text: 'UP',
        dot: false,
        pulse: false
      }
    };

    const indicator = indicators[status] || indicators.upcoming;

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {indicator.dot && (
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#ff0000',
            display: 'inline-block',
            animation: indicator.pulse ? 'pulse-dot 2s ease-in-out infinite alternate' : 'none'
          }} />
        )}
        <span style={{
          background: indicator.background,
          color: indicator.color,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '10px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {status === 'live' ? `${indicator.text}` : indicator.text}
        </span>
      </div>
    );
  };

  const getTeamIndicator = (teamName) => {
    // Team status dots - green for both teams as in design
    return (
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: '#00ff88',
        display: 'inline-block',
        marginRight: '8px'
      }} />
    );
  };

  return (
    <article 
      className="match-analytics-card"
      onClick={onClick}
      style={{
        background: '#2a2a2a',
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        border: isActive ? '2px solid #00ff88' : '1px solid #404040',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        position: 'relative',
        minWidth: '280px',
        maxWidth: '400px'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Match Analytics - ${match.home.name} vs ${match.away.name} - ${match.league}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick();
        }
      }}
    >
      {/* Card Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '500',
          color: '#ffffff',
          margin: 0,
          letterSpacing: '-0.025em'
        }}>
          Match Analytics
        </h3>
        {getStatusIndicator(match.status, match.time)}
      </div>

      {/* Card Body */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        {/* Team Names with Indicators */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '16px'
          }}>
            {getTeamIndicator(match.home.name)}
            {getTeamIndicator(match.away.name)}
          </div>
          <span style={{
            fontSize: '14px',
            fontWeight: '400',
            color: '#ffffff',
            letterSpacing: '-0.025em'
          }}>
            {match.home.name} vs {match.away.name}
          </span>
        </div>

        {/* Score Display */}
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#ffffff',
          marginLeft: '16px'
        }}>
          {match.score}
        </div>
      </div>

      {/* League Info */}
      <div style={{
        fontSize: '12px',
        fontWeight: '400',
        color: '#cccccc',
        marginBottom: '8px'
      }}>
        {match.league}
      </div>

      {/* Additional Match Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '11px',
        color: '#cccccc',
        borderTop: '1px solid #404040',
        paddingTop: '8px',
        marginTop: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>👥</span>
          <span>{Math.floor(Math.random() * 500) + 100} watching</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>⚡</span>
          <span>{Math.floor(Math.random() * 1000) + 200} reactions</span>
        </div>
        {match.status === 'live' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>⏱️</span>
            <span>{match.time}</span>
          </div>
        )}
      </div>

      {/* Active indicator overlay */}
      {isActive && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: '#00ff88',
          color: '#000000',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '10px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          ACTIVE
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-dot {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0.6; transform: scale(1.3); }
        }
        
        .match-analytics-card:focus {
          outline: 2px solid #00ff88;
          outline-offset: 2px;
        }
      `}</style>
    </article>
  );
}

export default MatchCard;
