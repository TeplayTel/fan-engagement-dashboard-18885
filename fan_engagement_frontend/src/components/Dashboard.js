import React, { useState, useEffect } from 'react';
import NavigationHeader from './NavigationHeader';
import MainFieldArea from './MainFieldArea';
import RightSidebar from './RightSidebar';
import BottomAnalytics from './BottomAnalytics';
import SportsFilter from './SportsFilter';
import CurrentMatchDisplay from './CurrentMatchDisplay';
import MatchThumbnailCard from './MatchThumbnailCard';

const placeholderMatches = [
  {
    id: 1,
    league: 'T20 World Cup',
    time: '15.2 overs',
    home: { name: 'India', logo: 'https://via.placeholder.com/48/FF6B35/FFFFFF?text=IND' },
    away: { name: 'Australia', logo: 'https://via.placeholder.com/48/FDE100/000000?text=AUS' },
    score: '187 - 156',
    wickets: '3',
    overs: '15.2',
    status: 'live',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1',
    thumbnail: 'https://via.placeholder.com/280x160/FF6B35/FFFFFF?text=IND+vs+AUS'
  },
  {
    id: 2,
    league: 'IPL 2024',
    time: 'Innings Break',
    home: { name: 'Mumbai Indians', logo: 'https://via.placeholder.com/48/004BA0/FFFFFF?text=MI' },
    away: { name: 'Chennai Super Kings', logo: 'https://via.placeholder.com/48/FDB900/000000?text=CSK' },
    score: '168 - 142',
    wickets: '6',
    overs: '20.0',
    status: 'halftime',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1',
    thumbnail: 'https://via.placeholder.com/280x160/004BA0/FFFFFF?text=MI+vs+CSK'
  },
  {
    id: 3,
    league: 'ODI Series',
    time: '23.4 overs',
    home: { name: 'England', logo: 'https://via.placeholder.com/48/012169/FFFFFF?text=ENG' },
    away: { name: 'Pakistan', logo: 'https://via.placeholder.com/48/01411C/FFFFFF?text=PAK' },
    score: '145 - 98',
    wickets: '2',
    overs: '23.4',
    status: 'live',
    videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0?autoplay=1&mute=1',
    thumbnail: 'https://via.placeholder.com/280x160/012169/FFFFFF?text=ENG+vs+PAK'
  },
  {
    id: 4,
    league: 'Test Championship',
    time: '67.2 overs',
    home: { name: 'South Africa', logo: 'https://via.placeholder.com/48/FFB612/000000?text=SA' },
    away: { name: 'New Zealand', logo: 'https://via.placeholder.com/48/000000/FFFFFF?text=NZ' },
    score: '287 - 234',
    wickets: '4',
    overs: '67.2',
    status: 'live',
    videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk?autoplay=1&mute=1',
    thumbnail: 'https://via.placeholder.com/280x160/FFB612/000000?text=SA+vs+NZ'
  },
  {
    id: 5,
    league: 'Big Bash League',
    time: 'Match Completed',
    home: { name: 'Sydney Sixers', logo: 'https://via.placeholder.com/48/FF0198/FFFFFF?text=SIX' },
    away: { name: 'Melbourne Stars', logo: 'https://via.placeholder.com/48/004225/FFFFFF?text=STA' },
    score: '176 - 164',
    wickets: '8',
    overs: '20.0',
    status: 'finished',
    videoUrl: 'https://www.youtube.com/embed/hFcLyDb6niA?autoplay=1&mute=1',
    thumbnail: 'https://via.placeholder.com/280x160/FF0198/FFFFFF?text=SIX+vs+STA'
  }
];

// PUBLIC_INTERFACE
function Dashboard() {
  /**
   * Refactored dashboard with current match display and thumbnail grid.
   * Features click-to-play functionality and real-time UI updates.
   */
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentMatchId, setCurrentMatchId] = useState(1); // Default to first match
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    // Simulate loading matches
    const timer = setTimeout(() => {
      setMatches(placeholderMatches);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Get current match and other matches
  const currentMatch = matches.find(match => match.id === currentMatchId);
  const otherMatches = matches.filter(match => match.id !== currentMatchId);

  const filteredMatches = otherMatches.filter(match => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'live') return match.status === 'live';
    if (selectedFilter === 'finished') return match.status === 'finished';
    return match.league.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  // PUBLIC_INTERFACE
  /**
   * Handles match selection and swapping with the current match
   * @param {object} selectedMatch - The match to switch to
   */
  const handleMatchSelect = async (selectedMatch) => {
    if (selectedMatch.id === currentMatchId || isSwapping) return;

    setIsSwapping(true);

    try {
      // Update the current match ID to switch the display
      setCurrentMatchId(selectedMatch.id);

      // Update the Header component with new match info
      const headerUpdateEvent = new CustomEvent('matchChanged', {
        detail: {
          matchTitle: `${selectedMatch.home.name} vs ${selectedMatch.away.name}`,
          league: selectedMatch.league,
          time: selectedMatch.time,
          status: selectedMatch.status
        }
      });
      window.dispatchEvent(headerUpdateEvent);

      // Update the video player URL if it has changed
      if (selectedMatch.videoUrl) {
        const videoUpdateEvent = new CustomEvent('videoChanged', {
          detail: { videoUrl: selectedMatch.videoUrl }
        });
        window.dispatchEvent(videoUpdateEvent);
      }

      // Update analytics context
      const analyticsUpdateEvent = new CustomEvent('activeMatchChanged', {
        detail: { 
          matchId: selectedMatch.id,
          matchInfo: selectedMatch
        }
      });
      window.dispatchEvent(analyticsUpdateEvent);

      // Small delay to show loading state
      setTimeout(() => {
        setIsSwapping(false);
      }, 500);

    } catch (error) {
      console.error('Error switching matches:', error);
      setIsSwapping(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container fade-in">
        {/* Navigation Header */}
        <NavigationHeader />
        
        {/* Main Content Loading */}
        <div className="main-content">
          <SportsFilter selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
          
          <div className="video-field-area">
            <div style={{
              width: '100%',
              height: '100%',
              background: 'var(--primary-bg)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                textAlign: 'center',
                color: 'var(--text-secondary)'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid var(--border-color)',
                  borderTop: '3px solid var(--accent-blue)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px'
                }}></div>
                <span>Loading match data...</span>
              </div>
            </div>
          </div>
          
          {/* Loading match selection */}
          <div className="match-selection-area">
            <div className="match-grid-header">
              <h3 className="match-grid-title">
                <span>🎬</span>
                Loading Matches...
              </h3>
            </div>
            <div className="matches-grid-horizontal">
              {[1, 2, 3, 4].map(i => (
                <div 
                  key={i}
                  style={{
                    width: '200px',
                    aspectRatio: '16 / 9',
                    background: 'var(--tertiary-bg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    animation: `pulse 1.5s ease-in-out infinite ${i * 0.2}s`,
                    flexShrink: 0
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Sidebar Loading */}
        <div className="right-panel">
          <div style={{
            background: 'var(--tertiary-bg)',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}>
            Loading statistics...
          </div>
        </div>
        
        {/* Bottom Analytics Loading */}
        <div className="bottom-analytics">
          <div style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}>
            Loading analytics...
          </div>
        </div>
        
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-container fade-in">
      {/* Navigation Header - Arena11 Design */}
      <NavigationHeader />
      
      {/* Main Central Area - Video/Field View */}
      <div className="main-content">
        {/* Sports Filter Bar */}
        <SportsFilter selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
        
        {/* Main Field/Video Area */}
        <div className="video-field-area">
          <MainFieldArea currentMatch={currentMatch} />
        </div>
        
        {/* Current Match Display */}
        <CurrentMatchDisplay 
          match={currentMatch}
          onMatchSelect={handleMatchSelect}
        />

        {/* Other Matches Selection */}
        <div className="match-selection-area">
          <div className="match-grid-header">
            <h3 className="match-grid-title">
              <span>🎬</span>
              Switch Match
            </h3>
            <div className="match-grid-count">
              {filteredMatches.length} available
            </div>
          </div>
          
          {filteredMatches.length === 0 ? (
            <div className="no-matches-message">
              <span className="no-matches-icon">🔍</span>
              <p>No matches found for the selected filter.</p>
              <button 
                className="show-all-btn"
                onClick={() => setSelectedFilter('all')}
              >
                Show All Matches
              </button>
            </div>
          ) : (
            <div className="matches-grid-horizontal">
              {filteredMatches.map((match, index) => (
                <MatchThumbnailCard
                  key={match.id}
                  match={match}
                  isActive={match.id === currentMatchId}
                  onMatchSelect={handleMatchSelect}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Right Sidebar - Player Stats & Team Info */}
      <RightSidebar currentMatch={currentMatch} />
      
      {/* Bottom Analytics Section */}
      <BottomAnalytics currentMatch={currentMatch} />
    </div>
  );
}

export default Dashboard;
