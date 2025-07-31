import React, { useState, useEffect } from 'react';
import Header from './Header';
import SportsFilter from './SportsFilter';
import MatchCard from './MatchCard';
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
    status: 'live'
  },
  {
    id: 2,
    league: 'La Liga',
    time: 'HT',
    home: { name: 'Real Madrid', logo: 'https://via.placeholder.com/48/FFFFFF/000000?text=RM' },
    away: { name: 'Barcelona', logo: 'https://via.placeholder.com/48/A50044/FFFFFF?text=FCB' },
    score: '0 - 0',
    status: 'halftime'
  },
  {
    id: 3,
    league: 'Serie A',
    time: '23\'',
    home: { name: 'AC Milan', logo: 'https://via.placeholder.com/48/FB090B/FFFFFF?text=ACM' },
    away: { name: 'Inter Milan', logo: 'https://via.placeholder.com/48/0068A8/FFFFFF?text=INT' },
    score: '1 - 0',
    status: 'live'
  }
];

const liveVideoUrl = "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1"; // Placeholder URL

// PUBLIC_INTERFACE
function Dashboard() {
  /**
   * The main dashboard component with enhanced loading and animations.
   */
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    // Simulate loading matches
    const timer = setTimeout(() => {
      setMatches(placeholderMatches);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const filteredMatches = matches.filter(match => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'live') return match.status === 'live';
    if (selectedFilter === 'finished') return match.status === 'finished';
    return match.league.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  return (
    <div className="dashboard fade-in">
      <Header />
      <SportsFilter selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
      <main className="main-content">
        <div className="matches-container">
          <VideoPlayer videoUrl={liveVideoUrl}>
            <EmojiReactions />
          </VideoPlayer>
          
          {loading ? (
            <div style={{ 
              display: 'grid', 
              gap: 'var(--space-md)',
              gridTemplateColumns: '1fr'
            }}>
              {[1, 2, 3].map(i => (
                <div 
                  key={i}
                  style={{
                    background: 'var(--glass-background)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-lg)',
                    border: '1px solid var(--border-color)',
                    animation: `pulse 1.5s ease-in-out infinite ${i * 0.2}s`
                  }}
                >
                  <div style={{
                    height: '20px',
                    background: 'var(--tertiary-background)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: 'var(--space-md)'
                  }}></div>
                  <div style={{
                    height: '60px',
                    background: 'var(--tertiary-background)',
                    borderRadius: 'var(--radius-sm)'
                  }}></div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gap: 'var(--space-md)',
              gridTemplateColumns: '1fr'
            }}>
              {filteredMatches.map((match, index) => (
                <div 
                  key={match.id}
                  style={{
                    animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <MatchCard match={match} />
                </div>
              ))}
            </div>
          )}
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

export default Dashboard;
