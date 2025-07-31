import React from 'react';

// PUBLIC_INTERFACE
function MatchCard({ match }) {
  /**
   * MatchCard component to display information about a single match.
   * @param {object} match - The match data.
   */
  return (
    <div className="match-card">
      <div className="match-card-header">
        <span className="match-league">{match.league}</span>
        <span className="match-time">{match.time}</span>
      </div>
      <div className="match-card-body">
        <div className="team">
          <img src={match.home.logo} alt={match.home.name} className="team-logo" />
          <span className="team-name">{match.home.name}</span>
        </div>
        <div className="match-score">
          <span>{match.score}</span>
        </div>
        <div className="team">
          <img src={match.away.logo} alt={match.away.name} className="team-logo" />
          <span className="team-name">{match.away.name}</span>
        </div>
      </div>
    </div>
  );
}

export default MatchCard;
