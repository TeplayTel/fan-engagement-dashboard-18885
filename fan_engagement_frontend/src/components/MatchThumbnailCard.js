import React, { useState } from 'react';

// PUBLIC_INTERFACE
function MatchThumbnailCard({ match, isActive, onMatchSelect, index }) {
  /**
   * Redesigned thumbnail card component with dark theme and consistent sizing.
   * Features clean, minimalist layout with team logos and consistent card dimensions.
   * @param {object} match - The match data
   * @param {boolean} isActive - Whether this match is currently playing
   * @param {function} onMatchSelect - Callback when card is clicked
   * @param {number} index - Card index for animation staggering
   */
  
  const [isLoading, setIsLoading] = useState(false);

  const handleCardClick = async () => {
    if (isActive || isLoading) return;
    
    setIsLoading(true);
    
    // Simulate loading delay for match switching
    setTimeout(() => {
      onMatchSelect(match);
      setIsLoading(false);
    }, 500);
  };

  // Generate team logo fallback with team colors
  const getTeamLogoFallback = (teamName, isHome = true) => {
    const teamColors = {
      'Arsenal': '#DC2626',
      'Chelsea': '#1E40AF',
      'Real Madrid': '#FFFFFF',
      'Barcelona': '#DC2626',
      'AC Milan': '#DC2626',
      'Inter Milan': '#1E40AF',
      'Lakers': '#552583',
      'Warriors': '#1D4ED8',
      'PSG': '#1E40AF',
      'Lyon': '#1E40AF'
    };
    
    const color = teamColors[teamName] || (isHome ? '#DC2626' : '#1E40AF');
    return color;
  };

  return (
    <article 
      className="dark-match-card"
      onClick={handleCardClick}
      style={{
        animationDelay: `${index * 0.1}s`,
        cursor: isActive ? 'default' : 'pointer',
        opacity: isLoading ? 0.6 : 1,
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
    >
      {/* Card Background - Dark Theme */}
      <div className="dark-card-background">
        {/* Team Logos Section */}
        <div className="dark-teams-section">
          {/* Home Team Logo */}
          <div className="dark-team-logo-container">
            {match.home.logo ? (
              <img 
                src={match.home.logo} 
                alt={match.home.name}
                className="dark-team-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="dark-team-logo-fallback"
              style={{
                backgroundColor: getTeamLogoFallback(match.home.name, true),
                display: match.home.logo ? 'none' : 'flex'
              }}
            >
              {match.home.name.substring(0, 3).toUpperCase()}
            </div>
          </div>

          {/* VS Text */}
          <div className="dark-vs-text">VS</div>

          {/* Away Team Logo */}
          <div className="dark-team-logo-container">
            {match.away.logo ? (
              <img 
                src={match.away.logo} 
                alt={match.away.name}
                className="dark-team-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="dark-team-logo-fallback"
              style={{
                backgroundColor: getTeamLogoFallback(match.away.name, false),
                display: match.away.logo ? 'none' : 'flex'
              }}
            >
              {match.away.name.substring(0, 3).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Watch Now Button */}
        <div className="dark-action-section">
          <button 
            className="dark-watch-button"
            disabled={isActive || isLoading}
          >
            {isActive ? 'NOW PLAYING' : isLoading ? 'Loading...' : 'Watch Now'}
          </button>
        </div>

        {/* Status Indicator */}
        {match.status === 'live' && (
          <div className="dark-live-indicator">
            <div className="dark-live-dot"></div>
            <span>LIVE</span>
          </div>
        )}

        {/* Active Indicator */}
        {isActive && (
          <div className="dark-active-indicator">
            <span>▶ PLAYING</span>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="dark-loading-overlay">
            <div className="dark-loading-spinner"></div>
            <span>Switching match...</span>
          </div>
        )}
      </div>

      {/* CSS Styles - Dark Theme with Consistent Sizing */}
      <style jsx>{`
        .dark-match-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeIn 0.6s ease-out both;
          /* Consistent sizing for all cards */
          width: 100%;
          height: 200px;
          min-height: 200px;
          max-height: 200px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: var(--glass-background);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
        }

        .dark-match-card:hover:not(.active) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
        }

        .dark-match-card:focus {
          outline: 2px solid var(--color-accent-blue);
          outline-offset: 2px;
        }

        .dark-card-background {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
          background: linear-gradient(135deg, 
            var(--color-bg-secondary) 0%, 
            var(--color-bg-tertiary) 100%);
          position: relative;
        }

        .dark-teams-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          flex: 1;
          margin-bottom: 16px;
        }

        .dark-team-logo-container {
          position: relative;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
        }

        .dark-team-logo {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .dark-team-logo-fallback {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: 700;
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }

        .dark-vs-text {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-secondary);
          letter-spacing: 0.1em;
          flex-shrink: 0;
        }

        .dark-action-section {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: auto;
        }

        .dark-watch-button {
          background: linear-gradient(135deg, var(--color-accent-blue) 0%, rgba(49, 130, 206, 0.8) 100%);
          color: var(--color-text-primary);
          border: none;
          padding: 8px 24px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(49, 130, 206, 0.3);
          min-width: 100px;
          flex-shrink: 0;
        }

        .dark-watch-button:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(49, 130, 206, 1.1) 0%, var(--color-accent-blue) 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(49, 130, 206, 0.4);
        }

        .dark-watch-button:disabled {
          background: var(--color-text-muted);
          color: var(--color-text-secondary);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .dark-live-indicator {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--color-accent-red);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 2px 8px rgba(229, 62, 62, 0.4);
        }

        .dark-live-dot {
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .dark-active-indicator {
          position: absolute;
          top: 12px;
          left: 12px;
          background: var(--color-accent-green);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 2px 8px rgba(56, 161, 105, 0.4);
        }

        .dark-loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: var(--color-text-primary);
          font-size: 12px;
          font-weight: 600;
          backdrop-filter: blur(4px);
        }

        .dark-loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid var(--color-accent-blue);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.5; 
            transform: scale(1.2);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .dark-match-card {
            height: 180px;
            min-height: 180px;
            max-height: 180px;
          }

          .dark-teams-section {
            gap: 16px;
          }

          .dark-team-logo-container {
            width: 40px;
            height: 40px;
          }

          .dark-team-logo,
          .dark-team-logo-fallback {
            width: 40px;
            height: 40px;
            font-size: 10px;
          }

          .dark-watch-button {
            padding: 6px 20px;
            font-size: 12px;
            min-width: 80px;
          }

          .dark-card-background {
            padding: 16px;
          }
        }

        @media (max-width: 480px) {
          .dark-match-card {
            height: 160px;
            min-height: 160px;
            max-height: 160px;
          }

          .dark-teams-section {
            gap: 12px;
          }

          .dark-team-logo-container {
            width: 36px;
            height: 36px;
          }

          .dark-team-logo,
          .dark-team-logo-fallback {
            width: 36px;
            height: 36px;
            font-size: 9px;
          }

          .dark-vs-text {
            font-size: 12px;
          }

          .dark-watch-button {
            padding: 5px 16px;
            font-size: 11px;
            min-width: 70px;
          }

          .dark-card-background {
            padding: 12px;
          }
        }
      `}</style>
    </article>
  );
}

export default MatchThumbnailCard;
