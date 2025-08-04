import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const MatchInfoPanel = styled.div`
  background: var(--tertiary-bg);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
`;

const ScoreDisplay = styled.div`
  text-align: center;
  margin-bottom: 15px;
`;

const TeamNames = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  color: var(--primary-text);
  margin-bottom: 10px;
`;

const TeamName = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  
  &.away {
    flex-direction: row-reverse;
  }
`;

const TeamLogo = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.color || 'var(--accent-blue)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: var(--font-bold);
  font-size: var(--font-sm);
`;

const Score = styled.div`
  font-size: var(--font-3xl);
  font-weight: var(--font-bold);
  color: var(--primary-text);
  text-align: center;
  letter-spacing: -0.05em;
`;

const MatchDetails = styled.div`
  font-size: var(--font-sm);
  color: var(--secondary-text);
  text-align: center;
  line-height: 1.4;
`;

const FormationPanel = styled.div`
  background: var(--tertiary-bg);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
`;

const FormationTitle = styled.h3`
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  color: var(--primary-text);
  margin-bottom: 15px;
  text-align: center;
  margin-top: 0;
`;

const FormationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  aspect-ratio: 3/4;
  background: linear-gradient(to bottom, #2d5a3d, #1e3a2a);
  border-radius: 6px;
  padding: 15px;
  position: relative;
  overflow: hidden;
`;

const FieldLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 40%;
    width: 20%;
    height: 80%;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.05);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 35%;
    left: 38%;
    width: 24%;
    height: 2px;
    background: rgba(255, 255, 255, 0.4);
  }
`;

const CreaseLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    top: 65%;
    left: 38%;
    width: 24%;
    height: 2px;
    background: rgba(255, 255, 255, 0.4);
  }
`;

const Stumps = styled.div`
  position: absolute;
  width: 2%;
  height: 3px;
  background: #8B4513;
  border-radius: 1px;
  
  &.striker {
    top: 66%;
    left: 49%;
  }
  
  &.non-striker {
    top: 34%;
    left: 49%;
  }
`;

const PlayerDot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.team === 'home' ? 'var(--team-blue)' : 'var(--team-red)'};
  border: 2px solid white;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: var(--font-bold);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  transform: translate(-50%, -50%);
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
`;

// PUBLIC_INTERFACE
const RightSidebarComponent = () => {
  /**
   * Right sidebar component with match information and formation visualization
   * following exact design specifications for layout and styling.
   */
  
  const battingTeamPositions = [
    { x: 50, y: 65, number: '1', role: 'batsman' }, // Striker
    { x: 50, y: 35, number: '2', role: 'batsman' }, // Non-striker
  ];
  
  const bowlingTeamPositions = [
    { x: 50, y: 25, number: '8', role: 'bowler' }, // Bowler
    { x: 50, y: 75, number: '1', role: 'keeper' }, // Keeper
    { x: 20, y: 40, number: '3', role: 'fielder' }, // Point
    { x: 80, y: 40, number: '4', role: 'fielder' }, // Cover
    { x: 35, y: 20, number: '5', role: 'fielder' }, // Mid-off
    { x: 65, y: 20, number: '6', role: 'fielder' }, // Mid-on
    { x: 30, y: 60, number: '7', role: 'fielder' }, // Square leg
    { x: 70, y: 60, number: '9', role: 'fielder' }, // Mid-wicket
    { x: 15, y: 80, number: '10', role: 'fielder' }, // Fine leg
    { x: 85, y: 80, number: '11', role: 'fielder' }, // Third man
    { x: 50, y: 10, number: '2', role: 'fielder' } // Long-off
  ];

  return (
    <SidebarContainer>
      <MatchInfoPanel>
        <ScoreDisplay>
          <TeamNames>
            <TeamName>
              <TeamLogo color="var(--team-blue)">IND</TeamLogo>
              India
            </TeamName>
            <TeamName className="away">
              <TeamLogo color="var(--team-red)">AUS</TeamLogo>
              Australia
            </TeamName>
          </TeamNames>
          <Score>187/3 (15.2)</Score>
        </ScoreDisplay>
        
        <MatchDetails>
          T20 World Cup • Semi-Final<br />
          Melbourne Cricket Ground<br />
          15.2 overs • Live
        </MatchDetails>
      </MatchInfoPanel>

      <FormationPanel>
        <FormationTitle>Field Positions</FormationTitle>
        <FormationGrid>
          <FieldLines />
          <CreaseLines />
          <Stumps className="striker" />
          <Stumps className="non-striker" />
          
          {/* Batting team players */}
          {battingTeamPositions.map((player, index) => (
            <PlayerDot
              key={`batting-${index}`}
              team="home"
              x={player.x}
              y={player.y}
              title={`${player.role} ${player.number}`}
            >
              {player.role === 'batsman' ? '🏏' : player.number}
            </PlayerDot>
          ))}
          
          {/* Bowling team players */}
          {bowlingTeamPositions.map((player, index) => (
            <PlayerDot
              key={`bowling-${index}`}
              team="away"
              x={player.x}
              y={player.y}
              title={`${player.role} ${player.number}`}
            >
              {player.role === 'bowler' ? '⚾' : player.role === 'keeper' ? '🥅' : player.number}
            </PlayerDot>
          ))}
        </FormationGrid>
      </FormationPanel>
    </SidebarContainer>
  );
};

export default RightSidebarComponent;
