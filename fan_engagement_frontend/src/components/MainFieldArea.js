import React, { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import EmojiReactions from './EmojiReactions';

// PUBLIC_INTERFACE
function MainFieldArea({ currentMatch }) {
  /**
   * Main central pitch/video viewing area with overlay elements.
   * Features 16:9 aspect ratio, player positions, score display, and overs.
   * Displays cricket pitch visualization with batsmen, bowlers, and fielders.
   */
  
  const [matchTime, setMatchTime] = useState('15.2 overs');
  const [playerPositions, setPlayerPositions] = useState([]);
  
  useEffect(() => {
    if (currentMatch) {
      setMatchTime(currentMatch.time);
      // Generate cricket player positions for demonstration
      generateCricketPositions();
    }
  }, [currentMatch]);

  const generateCricketPositions = () => {
    const positions = [];
    
    // Batsmen positions (at the crease)
    positions.push({
      id: 'striker',
      team: 'batting',
      role: 'batsman',
      x: 50, // Center of pitch
      y: 65, // Striker's end
      number: 1,
      name: 'Striker'
    });
    positions.push({
      id: 'non-striker',
      team: 'batting',
      role: 'batsman',
      x: 50, // Center of pitch
      y: 35, // Non-striker's end
      number: 2,
      name: 'Non-striker'
    });
    
    // Bowler
    positions.push({
      id: 'bowler',
      team: 'bowling',
      role: 'bowler',
      x: 50,
      y: 25, // Behind non-striker
      number: 8,
      name: 'Bowler'
    });
    
    // Wicket keeper
    positions.push({
      id: 'keeper',
      team: 'bowling',
      role: 'keeper',
      x: 50,
      y: 75, // Behind striker
      number: 1,
      name: 'Keeper'
    });
    
    // Fielders in various positions
    const fielderPositions = [
      { x: 20, y: 40, name: 'Point' },
      { x: 80, y: 40, name: 'Cover' },
      { x: 35, y: 20, name: 'Mid-off' },
      { x: 65, y: 20, name: 'Mid-on' },
      { x: 30, y: 60, name: 'Square leg' },
      { x: 70, y: 60, name: 'Mid-wicket' },
      { x: 15, y: 80, name: 'Fine leg' },
      { x: 85, y: 80, name: 'Third man' },
      { x: 50, y: 10, name: 'Long-off' }
    ];
    
    fielderPositions.forEach((pos, i) => {
      positions.push({
        id: `fielder-${i}`,
        team: 'bowling',
        role: 'fielder',
        x: pos.x,
        y: pos.y,
        number: i + 2,
        name: pos.name
      });
    });
    
    setPlayerPositions(positions);
  };

  const getTeamColor = (team, role) => {
    if (!currentMatch) {
      if (team === 'batting') return '#0066ff';
      if (team === 'bowling') return '#ff3333';
      return '#999999';
    }
    if (team === 'batting') return '#0066ff';
    if (team === 'bowling') return '#ff3333';
    return '#999999';
  };

  const getPlayerIcon = (role) => {
    switch(role) {
      case 'batsman': return '🏏';
      case 'bowler': return '⚾';
      case 'keeper': return '🥅';
      case 'fielder': return '👤';
      default: return '👤';
    }
  };

  return (
    <div className="main-field-area">
      {/* Background Cricket Pitch Visualization */}
      <div className="pitch-background">
        <div className="pitch-lines">
          <div className="pitch-rectangle"></div>
          <div className="crease-lines">
            <div className="batting-crease striker"></div>
            <div className="batting-crease non-striker"></div>
            <div className="popping-crease striker"></div>
            <div className="popping-crease non-striker"></div>
          </div>
          <div className="stumps striker"></div>
          <div className="stumps non-striker"></div>
        </div>
        
        {/* Player Position Indicators */}
        {playerPositions.map(player => (
          <div
            key={player.id}
            className={`player-indicator ${player.role}`}
            style={{
              left: `${player.x}%`,
              top: `${player.y}%`,
              backgroundColor: getTeamColor(player.team, player.role),
              borderColor: getTeamColor(player.team, player.role)
            }}
            title={`${player.name} (${player.role})`}
          >
            <span className="player-icon">{getPlayerIcon(player.role)}</span>
            <span className="player-number">{player.number}</span>
          </div>
        ))}
      </div>

      {/* Top Overlay - Score and Overs */}
      <div className="pitch-top-overlay">
        <div className="match-score-overlay">
          {currentMatch && (
            <>
              <div className="team-score batting">
                <img src={currentMatch.home.logo} alt={currentMatch.home.name} />
                <div className="cricket-score">
                  <span className="runs">{currentMatch.score.split(' - ')[0]}</span>
                  <span className="wickets-overs">/{currentMatch.wickets || '2'} ({currentMatch.overs || '15.2'})</span>
                </div>
                <span className="innings-indicator">1st Innings</span>
              </div>
              <div className="vs-separator">vs</div>
              <div className="team-score bowling">
                <span className="target">Target: {parseInt(currentMatch.score.split(' - ')[0]) + 1}</span>
                <img src={currentMatch.away.logo} alt={currentMatch.away.name} />
              </div>
            </>
          )}
        </div>
        
        <div className="match-time-overlay">
          <div className="time-display">
            <span className="time-icon">🏏</span>
            <span className="time-text">{matchTime}</span>
          </div>
          {currentMatch?.status === 'live' && (
            <div className="live-indicator-small">
              <div className="live-dot"></div>
              <span>LIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Video Player Integration */}
      <VideoPlayer 
        videoUrl={currentMatch?.videoUrl || 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1'}
        currentMatch={currentMatch}
      >
        <EmojiReactions currentMatch={currentMatch} />
      </VideoPlayer>

      {/* Bottom Control Bar */}
      <div className="pitch-bottom-controls">
        <div className="playback-controls">
          <button className="control-btn">
            <span>⏮️</span>
          </button>
          <button className="control-btn primary">
            <span>⏸️</span>
          </button>
          <button className="control-btn">
            <span>⏭️</span>
          </button>
        </div>
        
        <div className="timeline-container">
          <div className="timeline-bar">
            <div className="timeline-progress" style={{ width: '68%' }}></div>
            <div className="timeline-handle" style={{ left: '68%' }}></div>
          </div>
        </div>
        
        <div className="volume-controls">
          <button className="control-btn">
            <span>🔊</span>
          </button>
          <button className="control-btn">
            <span>⛶</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainFieldArea;
