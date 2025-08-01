import React, { useState } from 'react';

// PUBLIC_INTERFACE
function MatchThumbnailCard({ match, isActive, onMatchSelect, index }) {
  /**
   * Redesigned thumbnail card component matching the Meta design reference.
   * Features clean, minimalist layout with team logos and yellow "Watch Now" button.
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
      className="meta-match-card"
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
      {/* Card Background - Clean White */}
      <div className="meta-card-background">
        {/* Team Logos Section */}
        <div className="meta-teams-section">
          {/* Home Team Logo */}
          <div className="meta-team-logo-container">
            {match.home.logo ? (
              <img 
                src={match.home.logo} 
                alt={match.home.name}
                className="meta-team-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="meta-team-logo-fallback"
              style={{
                backgroundColor: getTeamLogoFallback(match.home.name, true),
                display: match.home.logo ? 'none' : 'flex'
              }}
            >
              {match.home.name.substring(0, 3).toUpperCase()}
            </div>
          </div>

          {/* VS Text */}
          <div className="meta-vs-text">VS</div>

          {/* Away Team Logo */}
          <div className="meta-team-logo-container">
            {match.away.logo ? (
              <img 
                src={match.away.logo} 
                alt={match.away.name}
                className="meta-team-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="meta-team-logo-fallback"
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
        <div className="meta-action-section">
          <button 
            className="meta-watch-button"
            disabled={isActive || isLoading}
          >
            {isActive ? 'NOW PLAYING' : isLoading ? 'Loading...' : 'Watch Now'}
          </button>
        </div>

        {/* Status Indicator */}
        {match.status === 'live' && (
          <div className="meta-live-indicator">
            <div className="meta-live-dot"></div>
            <span>LIVE</span>
          </div>
        )}

        {/* Active Indicator */}
        {isActive && (
          <div className="meta-active-indicator">
            <span>▶ PLAYING</span>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="meta-loading-overlay">
            <div className="meta-loading-spinner"></div>
            <span>Switching match...</span>
          </div>
        )}
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .meta-match-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeIn 0.6s ease-out both;
          aspect-ratio: 3 / 2;
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .meta-match-card:hover:not(.active) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-color: #D1D5DB;
        }

        .meta-match-card:focus {
          outline: 2px solid #3B82F6;
          outline-offset: 2px;
        }

        .meta-card-background {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
          background: #FFFFFF;
          position: relative;
        }

        .meta-teams-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          flex: 1;
          margin-bottom: 16px;
        }

        .meta-team-logo-container {
          position: relative;
          width: 48px;
          height: 48px;
        }

        .meta-team-logo {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #F3F4F6;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .meta-team-logo-fallback {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: 700;
          border: 2px solid #F3F4F6;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .meta-vs-text {
          font-size: 14px;
          font-weight: 600;
          color: #6B7280;
          letter-spacing: 0.05em;
        }

        .meta-action-section {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .meta-watch-button {
          background-color: #FBBF24;
          color: #1F2937;
          border: none;
          padding: 8px 24px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          min-width: 100px;
        }

        .meta-watch-button:hover:not(:disabled) {
          background-color: #F59E0B;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        .meta-watch-button:disabled {
          background-color: #9CA3AF;
          color: #FFFFFF;
          cursor: not-allowed;
          transform: none;
        }

        .meta-live-indicator {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: #DC2626;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .meta-live-dot {
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .meta-active-indicator {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #10B981;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .meta-loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #374151;
          font-size: 12px;
          font-weight: 600;
          backdrop-filter: blur(2px);
        }

        .meta-loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #E5E7EB;
          border-top: 2px solid #3B82F6;
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
          .meta-teams-section {
            gap: 16px;
          }

          .meta-team-logo-container {
            width: 40px;
            height: 40px;
          }

          .meta-team-logo,
          .meta-team-logo-fallback {
            width: 40px;
            height: 40px;
            font-size: 10px;
          }

          .meta-watch-button {
            padding: 6px 20px;
            font-size: 12px;
            min-width: 80px;
          }

          .meta-card-background {
            padding: 16px;
          }
        }

        @media (max-width: 480px) {
          .meta-teams-section {
            gap: 12px;
          }

          .meta-team-logo-container {
            width: 36px;
            height: 36px;
          }

          .meta-team-logo,
          .meta-team-logo-fallback {
            width: 36px;
            height: 36px;
            font-size: 9px;
          }

          .meta-vs-text {
            font-size: 12px;
          }

          .meta-watch-button {
            padding: 5px 16px;
            font-size: 11px;
            min-width: 70px;
          }

          .meta-card-background {
            padding: 12px;
          }
        }
      `}</style>
    </article>
  );
}

export default MatchThumbnailCard;
