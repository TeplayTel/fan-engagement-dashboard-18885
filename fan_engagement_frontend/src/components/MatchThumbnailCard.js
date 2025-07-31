import React, { useState } from 'react';

// PUBLIC_INTERFACE
function MatchThumbnailCard({ match, isActive, onMatchSelect, index }) {
  /**
   * Thumbnail card component for displaying matches in a grid layout.
   * Based on the design notes for responsive grid cards with hover effects.
   * @param {object} match - The match data
   * @param {boolean} isActive - Whether this match is currently playing
   * @param {function} onMatchSelect - Callback when card is clicked
   * @param {number} index - Card index for animation staggering
   */
  
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCardClick = async () => {
    if (isActive || isLoading) return;
    
    setIsLoading(true);
    
    // Simulate loading delay for match switching
    setTimeout(() => {
      onMatchSelect(match);
      setIsLoading(false);
    }, 500);
  };

  const getStatusIndicator = (status, time) => {
    const indicators = {
      live: { text: 'LIVE', color: '#ff0000', icon: '🔴' },
      halftime: { text: 'HT', color: '#ffa502', icon: '⏸️' },
      finished: { text: 'FT', color: '#666666', icon: '✓' },
      upcoming: { text: 'UP', color: '#3742fa', icon: '⏰' }
    };
    
    const indicator = indicators[status] || indicators.upcoming;
    
    return (
      <div className="status-indicator" style={{
        background: indicator.color,
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        animation: status === 'live' ? 'pulse-glow 2s ease-in-out infinite alternate' : 'none'
      }}>
        <span>{indicator.icon}</span>
        <span>{status === 'live' ? `${indicator.text} ${time}` : indicator.text}</span>
      </div>
    );
  };

  // Generate thumbnail placeholder based on teams
  const generateThumbnail = (match) => {
    const colors = [
      'linear-gradient(135deg, #FF6B35, #F7931E)',
      'linear-gradient(135deg, #003F7F, #0066CC)', 
      'linear-gradient(135deg, #FB090B, #FF4757)',
      'linear-gradient(135deg, #0068A8, #00A8FF)',
      'linear-gradient(135deg, #A50044, #FF3366)'
    ];
    return colors[match.id % colors.length];
  };

  return (
    <article 
      className={`match-thumbnail-card ${isActive ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
      onClick={handleCardClick}
      style={{
        animationDelay: `${index * 0.1}s`,
        cursor: isActive ? 'default' : 'pointer',
        opacity: isLoading ? 0.7 : 1,
        transform: isActive ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.2s ease-in-out',
        border: isActive ? '2px solid #00ff88' : '1px solid #404040'
      }}
      role="button"
      tabIndex={0}
      aria-label={`${match.home.name} vs ${match.away.name} - ${match.league} - ${match.status === 'live' ? 'Live match' : match.status}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      onMouseEnter={(e) => {
        if (!isActive && !isLoading) {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
          e.currentTarget.style.borderColor = '#ffffff';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive && !isLoading) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
          e.currentTarget.style.borderColor = '#404040';
        }
      }}
    >
      {/* Thumbnail Image/Background */}
      <div 
        className="card-thumbnail"
        style={{
          background: generateThumbnail(match),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay with match info */}
        <div className="card-overlay">
          {/* Status badge */}
          <div className="card-status">
            {getStatusIndicator(match.status, match.time)}
          </div>

          {/* Active match indicator */}
          {isActive && (
            <div className="now-playing-badge">
              <span className="now-playing-icon">▶️</span>
              <span className="now-playing-text">NOW PLAYING</span>
            </div>
          )}

          {/* Loading overlay */}
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <span>Loading...</span>
            </div>
          )}
        </div>

        {/* Teams display at bottom */}
        <div className="card-teams">
          <div className="teams-container">
            <div className="team-mini">
              <img 
                src={match.home.logo} 
                alt={match.home.name}
                className="team-mini-logo"
                onLoad={() => setImageLoaded(true)}
              />
              <span className="team-mini-name">{match.home.name}</span>
            </div>
            
            <div className="score-mini">
              <span className="score-mini-text">{match.score}</span>
            </div>
            
            <div className="team-mini">
              <span className="team-mini-name">{match.away.name}</span>
              <img 
                src={match.away.logo} 
                alt={match.away.name}
                className="team-mini-logo"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>
          
          {/* League info */}
          <div className="league-mini">
            <span className="league-mini-text">{match.league}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default MatchThumbnailCard;
