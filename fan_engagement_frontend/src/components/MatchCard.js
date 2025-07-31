import React from 'react';

// PUBLIC_INTERFACE
function MatchCard({ match }) {
  /**
   * Enhanced MatchCard component to display information about a single match.
   * @param {object} match - The match data with status and enhanced info.
   */
  
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
        padding: 'var(--space-xs) var(--space-sm)',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-xs)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {status === 'live' && <span style={{ fontSize: '0.6rem' }}>🔴</span>}
        {status === 'halftime' ? 'HT' : status === 'live' ? time : status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="match-card">
      <div className="match-card-header">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-sm)' 
        }}>
          <span style={{
            color: 'var(--secondary-text)',
            fontSize: '0.875rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)'
          }}>
            <span>🏆</span>
            {match.league}
          </span>
        </div>
        {getStatusBadge(match.status, match.time)}
      </div>
      
      <div className="match-card-body">
        <div className="team">
          <div style={{ position: 'relative' }}>
            <img 
              src={match.home.logo} 
              alt={match.home.name} 
              className="team-logo"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
              }}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <span className="team-name">{match.home.name}</span>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--tertiary-text)',
              marginTop: 'var(--space-xs)'
            }}>
              HOME
            </div>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          padding: '0 var(--space-md)'
        }}>
          <div className="match-score">
            <span>{match.score}</span>
          </div>
          {match.status === 'live' && (
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--secondary-text)',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-xs)'
            }}>
              <span>⏱️</span>
              <span>{match.time}</span>
            </div>
          )}
        </div>
        
        <div className="team">
          <div style={{ position: 'relative' }}>
            <img 
              src={match.away.logo} 
              alt={match.away.name} 
              className="team-logo"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
              }}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <span className="team-name">{match.away.name}</span>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--tertiary-text)',
              marginTop: 'var(--space-xs)'
            }}>
              AWAY
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional match info */}
      <div style={{
        marginTop: 'var(--space-md)',
        padding: 'var(--space-sm) 0',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.75rem',
        color: 'var(--secondary-text)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          <span>📺</span>
          <span>{Math.floor(Math.random() * 500) + 100} watching</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          <span>🎯</span>
          <span>{Math.floor(Math.random() * 1000) + 200} reactions</span>
        </div>
      </div>
    </div>
  );
}

export default MatchCard;
