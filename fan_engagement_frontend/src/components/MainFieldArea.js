import React, { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import EmojiReactions from './EmojiReactions';

// PUBLIC_INTERFACE
function MainFieldArea({ currentMatch }) {
  /**
   * Main central field/video viewing area with overlay elements.
   * Features 16:9 aspect ratio, player positions, score display, and time.
   * Matches the sports field visualization from design specs.
   */
  
  const [matchTime, setMatchTime] = useState('88\'');
  const [playerPositions, setPlayerPositions] = useState([]);
  
  useEffect(() => {
    if (currentMatch) {
      setMatchTime(currentMatch.time);
      // Generate random player positions for demonstration
      generatePlayerPositions();
    }
  }, [currentMatch]);

  const generatePlayerPositions = () => {
    const positions = [];
    // Generate home team positions (left side)
    for (let i = 0; i < 11; i++) {
      positions.push({
        id: `home-${i}`,
        team: 'home',
        x: Math.random() * 45 + 5, // Left side of field
        y: Math.random() * 80 + 10,
        number: i + 1
      });
    }
    // Generate away team positions (right side)
    for (let i = 0; i < 11; i++) {
      positions.push({
        id: `away-${i}`,
        team: 'away',
        x: Math.random() * 45 + 50, // Right side of field
        y: Math.random() * 80 + 10,
        number: i + 1
      });
    }
    setPlayerPositions(positions);
  };

  const getTeamColor = (team) => {
    if (!currentMatch) return team === 'home' ? '#0066ff' : '#ff3333';
    return team === 'home' ? '#0066ff' : '#ff3333';
  };

  return (
    <div className="main-field-area">
      {/* Background Field Visualization */}
      <div className="field-background">
        <div className="field-lines">
          <div className="center-circle"></div>
          <div className="center-line"></div>
          <div className="penalty-area left"></div>
          <div className="penalty-area right"></div>
          <div className="goal-area left"></div>
          <div className="goal-area right"></div>
        </div>
        
        {/* Player Position Indicators */}
        {playerPositions.map(player => (
          <div
            key={player.id}
            className="player-indicator"
            style={{
              left: `${player.x}%`,
              top: `${player.y}%`,
              backgroundColor: getTeamColor(player.team),
              borderColor: getTeamColor(player.team)
            }}
          >
            <span className="player-number">{player.number}</span>
          </div>
        ))}
      </div>

      {/* Top Overlay - Score and Time */}
      <div className="field-top-overlay">
        <div className="match-score-overlay">
          {currentMatch && (
            <>
              <div className="team-score">
                <img src={currentMatch.home.logo} alt={currentMatch.home.name} />
                <span className="score-number">{currentMatch.score.split(' - ')[0]}</span>
              </div>
              <div className="vs-separator">-</div>
              <div className="team-score">
                <span className="score-number">{currentMatch.score.split(' - ')[1]}</span>
                <img src={currentMatch.away.logo} alt={currentMatch.away.name} />
              </div>
            </>
          )}
        </div>
        
        <div className="match-time-overlay">
          <div className="time-display">
            <span className="time-icon">⏱️</span>
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
      <div className="field-bottom-controls">
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
