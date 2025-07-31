import React, { useState, useEffect } from 'react';
import Header from './Header';
import SportsFilter from './SportsFilter';
import CurrentMatchDisplay from './CurrentMatchDisplay';
import MatchThumbnailCard from './MatchThumbnailCard';
import EmojiReactions from './EmojiReactions';
import Analytics from './Analytics';
import VideoPlayer from './VideoPlayer';

const placeholderMatches = [
  {
    id: 1,
    league: 'Premier League',
    time: '88\'',
    home: { name: 'Arsenal', logo: 'https://via.placeholder.com/48/FF6B35/FFFFFF?text=ARS' },
    away: { name: 'Chelsea', logo: 'https://via.placeholder.com/48/003F7F/FFFFFF?text=CHE' },
    score: '2 - 1',
    status: 'live',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1',
    thumbnail: 'https://via.placeholder.com/280x160/FF6B35/FFFFFF?text=ARS+vs+CHE'
  },
  {
    id: 2,
    league: 'La Liga',
    time: 'HT',
    home: { name: 'Real Madrid', logo: 'https://via.placeholder.com/48/FFFFFF/000000?text=RM' },
    away: { name: 'Barcelona', logo: 'https://via.placeholder.com/48/A50044/FFFFFF?text=FCB' },
    score: '0 - 0',
    status: 'halftime',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1',
    thumbnail: 'https://via.placeholder.com/280x160/FFFFFF/000000?text=RM+vs+FCB'
  },
  {
    id: 3,
    league: 'Serie A',
    time: '23\'',
    home: { name: 'AC Milan', logo: 'https://via.placeholder.com/48/FB090B/FFFFFF?text=ACM' },
    away: { name: 'Inter Milan', logo: 'https://via.placeholder.com/48/0068A8/FFFFFF?text=INT' },
    score: '1 - 0',
    status: 'live',
    videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0?autoplay=1&mute=1',
    thumbnail: 'https://via.placeholder.com/280x160/FB090B/FFFFFF?text=ACM+vs+INT'
  },
  {
    id: 4,
    league: 'Bundesliga',
    time: '67\'',
    home: { name: 'Bayern Munich', logo: 'https://via.placeholder.com/48/DC143C/FFFFFF?text=FCB' },
    away: { name: 'Borussia Dortmund', logo: 'https://via.placeholder.com/48/FDE100/000000?text=BVB' },
    score: '3 - 2',
    status: 'live',
    videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk?autoplay=1&mute=1',
    thumbnail: 'https://via.placeholder.com/280x160/DC143C/FFFFFF?text=FCB+vs+BVB'
  },
  {
    id: 5,
    league: 'Ligue 1',
    time: 'FT',
    home: { name: 'PSG', logo: 'https://via.placeholder.com/48/004170/FFFFFF?text=PSG' },
    away: { name: 'Lyon', logo: 'https://via.placeholder.com/48/1e3a8a/FFFFFF?text=OL' },
    score: '2 - 1',
    status: 'finished',
    videoUrl: 'https://www.youtube.com/embed/hFcLyDb6niA?autoplay=1&mute=1',
    thumbnail: 'https://via.placeholder.com/280x160/004170/FFFFFF?text=PSG+vs+OL'
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
      <div className="dashboard fade-in">
        <Header />
        <SportsFilter selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
        <main className="main-content">
          <div className="matches-container">
            <VideoPlayer videoUrl="">
              <EmojiReactions />
            </VideoPlayer>
            
            {/* Loading current match display */}
            <div className="current-match-display loading">
              <div className="current-match-content">
                <div className="loading-placeholder">
                  <span>Loading current match...</span>
                </div>
              </div>
            </div>

            {/* Loading grid */}
            <div className="match-grid-container">
              <div className="match-grid-header">
                <h2 className="match-grid-title">
                  <span>🎬</span>
                  Other Matches
                </h2>
              </div>
              <div className="matches-grid">
                {[1, 2, 3, 4].map(i => (
                  <div 
                    key={i}
                    style={{
                      background: 'var(--glass-background)',
                      borderRadius: 'var(--radius-md)',
                      aspectRatio: '16 / 9',
                      border: '1px solid var(--border-color)',
                      animation: `pulse 1.5s ease-in-out infinite ${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="right-panel">
            <div style={{ animation: 'fadeIn 0.6s ease-out 0.3s both' }}>
              <Analytics />
            </div>
          </div>
        </main>
        
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard fade-in">
      <Header currentMatch={currentMatch} />
      <SportsFilter selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
      <main className="main-content">
        <div className="matches-container">
          {/* Video Player with current match */}
          <VideoPlayer 
            videoUrl={currentMatch?.videoUrl || 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1'}
            currentMatch={currentMatch}
          >
            <EmojiReactions currentMatch={currentMatch} />
          </VideoPlayer>
          
          {/* Current Match Display - Who vs Who Row */}
          <CurrentMatchDisplay 
            match={currentMatch}
            onMatchSelect={handleMatchSelect}
          />

          {/* Other Matches Grid */}
          <div className="match-grid-container">
            <div className="match-grid-header">
              <h2 className="match-grid-title">
                <span>🎬</span>
                Other Matches
              </h2>
              <div className="match-grid-count">
                {filteredMatches.length} available
              </div>
            </div>
            
            {filteredMatches.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: 'var(--space-xl)',
                color: 'var(--secondary-text)',
                background: 'var(--glass-background)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <span style={{ fontSize: '2rem', marginBottom: 'var(--space-md)', display: 'block' }}>🔍</span>
                <p>No matches found for the selected filter.</p>
                <button 
                  onClick={() => setSelectedFilter('all')}
                  style={{
                    background: 'var(--accent-blue)',
                    color: 'white',
                    border: 'none',
                    padding: 'var(--space-sm) var(--space-md)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    marginTop: 'var(--space-sm)'
                  }}
                >
                  Show All Matches
                </button>
              </div>
            ) : (
              <>
                {/* Thumbnail Grid */}
                <div className="matches-grid">
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
              </>
            )}
          </div>
        </div>
        <div className="right-panel">
          <div style={{ animation: 'fadeIn 0.6s ease-out 0.3s both' }}>
            <Analytics currentMatch={currentMatch} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
