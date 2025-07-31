import React from 'react';
import Header from './Header';
import SportsFilter from './SportsFilter';
import MatchCard from './MatchCard';
import EmojiReactions from './EmojiReactions';
import Analytics from './Analytics';

const placeholderMatches = [
  {
    league: 'Premier League',
    time: '88\'',
    home: { name: 'Arsenal', logo: 'https://via.placeholder.com/40' },
    away: { name: 'Chelsea', logo: 'https://via.placeholder.com/40' },
    score: '2 - 1',
  },
  {
    league: 'La Liga',
    time: 'HT',
    home: { name: 'Real Madrid', logo: 'https://via.placeholder.com/40' },
    away: { name: 'Barcelona', logo: 'https://via.placeholder.com/40' },
    score: '0 - 0',
  },
];

// PUBLIC_INTERFACE
function Dashboard() {
  /**
   * The main dashboard component.
   */
  return (
    <div className="dashboard">
      <Header />
      <SportsFilter />
      <main className="main-content">
        <div className="matches-container">
          {placeholderMatches.map((match, index) => (
            <MatchCard key={index} match={match} />
          ))}
        </div>
        <div className="right-panel">
            <EmojiReactions />
            <Analytics />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
