import React, { useState, useEffect } from 'react';
import Header from './Header';
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
    sport: 'football',
    home: { name: 'Arsenal', logo: null }, // Missing logo to test name display
    away: { name: 'Chelsea', logo: 'https://via.placeholder.com/48/003F7F/FFFFFF?text=CHE' },
    score: '2 - 1',
    status: 'live',
    videoType: 'live',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1',
    thumbnail: 'https://via.placeholder.com/280x160/FF6B35/FFFFFF?text=ARS+vs+CHE'
  },
  {
    id: 2,
    league: 'La Liga',
    time: 'HT',
    sport: 'football',
    home: { name: 'Real Madrid', logo: 'https://via.placeholder.com/48/FFFFFF/000000?text=RM' },
    away: { name: 'Barcelona', logo: null }, // Missing logo to test name display
    score: '0 - 0',
    status: 'halftime',
    videoType: 'live',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1',
    thumbnail: 'https://via.placeholder.com/280x160/FFFFFF/000000?text=RM+vs+FCB'
  },
  {
    id: 3,
    league: 'Serie A',
    time: '23\'',
    sport: 'football',
    home: { name: 'AC Milan', logo: 'https://via.placeholder.com/48/FB090B/FFFFFF?text=ACM' },
    away: { name: 'Inter Milan', logo: 'https://via.placeholder.com/48/0068A8/FFFFFF?text=INT' },
    score: '1 - 0',
    status: 'live',
    videoType: 'live',
    videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0?autoplay=1&mute=1',
    thumbnail: 'https://via.placeholder.com/280x160/FB090B/FFFFFF?text=ACM+vs+INT'
  },
  {
    id: 4,
    league: 'NBA',
    time: '67\'',
    sport: 'basketball',
    home: { name: 'Lakers', logo: 'https://via.placeholder.com/48/552583/FFFFFF?text=LAL' },
    away: { name: 'Warriors', logo: null }, // Missing logo to test name display
    score: '95 - 92',
    status: 'live',
    videoType: 'live',
    videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk?autoplay=1&mute=1',
    thumbnail: 'https://via.placeholder.com/280x160/552583/FFFFFF?text=LAL+vs+GSW'
  },
  {
    id: 5,
    league: 'Champions League',
    time: 'FT',
    sport: 'football',
    home: { name: 'PSG', logo: 'https://via.placeholder.com/48/004170/FFFFFF?text=PSG' },
    away: { name: 'Lyon', logo: 'https://via.placeholder.com/48/1e3a8a/FFFFFF?text=OL' },
    score: '2 - 1',
    status: 'finished',
    videoType: 'recorded',
    videoUrl: 'https://www.youtube.com/embed/hFcLyDb6niA?autoplay=1&mute=1',
    thumbnail: 'https://via.placeholder.com/280x160/004170/FFFFFF?text=PSG+vs+OL'
  },
  {
    id: 6,
    league: 'Wimbledon',
    time: 'SET 3',
    sport: 'tennis',
    home: { name: 'Djokovic', logo: null },
    away: { name: 'Nadal', logo: null },
    score: '2 - 1',
    status: 'live',
    videoType: 'live',
    videoUrl: 'https://www.youtube.com/embed/tennis123?autoplay=1&mute=1',
    thumbnail: 'https://via.placeholder.com/280x160/228B22/FFFFFF?text=Tennis'
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
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all_status');
  const [selectedSportFilter, setSelectedSportFilter] = useState('all_sports');
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

  // Filter other matches by status and sport
  const filteredMatches = otherMatches.filter(match => {
    // Status filter (live/recorded)
    let statusMatch = true;
    if (selectedStatusFilter === 'live') {
      statusMatch = match.status === 'live' || match.videoType === 'live';
    } else if (selectedStatusFilter === 'recorded') {
      statusMatch = match.status === 'finished' || match.videoType === 'recorded';
    }

    // Sport filter
    let sportMatch = true;
    if (selectedSportFilter !== 'all_sports') {
      sportMatch = match.sport === selectedSportFilter;
    }

    return statusMatch && sportMatch;
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
            
            {/* Sport Filter for Other Matches */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <div className="sport-filter-bar">
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--space-sm)',
                  marginBottom: 'var(--space-sm)',
                  color: 'var(--secondary-text)',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  <span>⚽</span>
                  <span>Filter by sport:</span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: 'var(--space-sm)', 
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}>
                  {[
                    { id: 'all_sports', label: 'All Sports', icon: '🏆' },
                    { id: 'football', label: 'Football', icon: '⚽' },
                    { id: 'basketball', label: 'Basketball', icon: '🏀' },
                    { id: 'tennis', label: 'Tennis', icon: '🎾' }
                  ].map((option) => (
                    <button 
                      key={option.id}
                      className={`sport-filter-btn ${selectedSportFilter === option.id ? 'active' : ''}`}
                      onClick={() => setSelectedSportFilter(option.id)}
                      aria-label={`Filter by ${option.label}`}
                      title={`Show ${option.label.toLowerCase()} matches`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-xs)',
                        position: 'relative'
                      }}
                    >
                      <span style={{ fontSize: '0.875rem' }}>{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Status Filter for Other Matches */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <div className="status-filter-bar">
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--space-sm)',
                  marginBottom: 'var(--space-sm)',
                  color: 'var(--secondary-text)',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  <span>📡</span>
                  <span>Filter by status:</span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: 'var(--space-sm)', 
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}>
                  {[
                    { id: 'all_status', label: 'All', icon: '📺' },
                    { id: 'live', label: 'Live', icon: '🔴' },
                    { id: 'recorded', label: 'Recorded', icon: '📹' }
                  ].map((option) => (
                    <button 
                      key={option.id}
                      className={`filter-btn ${selectedStatusFilter === option.id ? 'active' : ''}`}
                      onClick={() => setSelectedStatusFilter(option.id)}
                      aria-label={`Filter by ${option.label}`}
                      title={`Show ${option.label.toLowerCase()} matches`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-xs)',
                        position: 'relative'
                      }}
                    >
                      <span style={{ fontSize: '0.875rem' }}>{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
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
                  onClick={() => {
                    setSelectedStatusFilter('all_status');
                    setSelectedSportFilter('all_sports');
                  }}
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
