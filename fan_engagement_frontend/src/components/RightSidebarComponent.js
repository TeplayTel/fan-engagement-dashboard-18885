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
  background: linear-gradient(to bottom, #1a4a3a, #1a3a4a);
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
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
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
  
  const homeFormation = [
    { x: 50, y: 90, number: '1' }, // GK
    { x: 20, y: 70, number: '3' }, // LB
    { x: 40, y: 75, number: '6' }, // CB
    { x: 60, y: 75, number: '4' }, // CB
    { x: 80, y: 70, number: '2' }, // RB
    { x: 30, y: 50, number: '8' }, // CM
    { x: 70, y: 50, number: '5' }, // CM
    { x: 15, y: 30, number: '11' }, // LW
    { x: 50, y: 25, number: '10' }, // AM
    { x: 85, y: 30, number: '7' }, // RW
    { x: 50, y: 10, number: '9' } // ST
  ];
  
  const awayFormation = [
    { x: 50, y: 10, number: '1' }, // GK
    { x: 80, y: 30, number: '2' }, // RB
    { x: 60, y: 25, number: '4' }, // CB
    { x: 40, y: 25, number: '6' }, // CB
    { x: 20, y: 30, number: '3' }, // LB
    { x: 70, y: 50, number: '5' }, // CM
    { x: 30, y: 50, number: '8' }, // CM
    { x: 85, y: 70, number: '7' }, // RW
    { x: 50, y: 75, number: '10' }, // AM
    { x: 15, y: 70, number: '11' }, // LW
    { x: 50, y: 90, number: '9' } // ST
  ];

  return (
    <SidebarContainer>
      <MatchInfoPanel>
        <ScoreDisplay>
          <TeamNames>
            <TeamName>
              <TeamLogo color="var(--team-blue)">CHE</TeamLogo>
              Chelsea
            </TeamName>
            <TeamName className="away">
              <TeamLogo color="var(--team-red)">ARS</TeamLogo>
              Arsenal
            </TeamName>
          </TeamNames>
          <Score>2 - 1</Score>
        </ScoreDisplay>
        
        <MatchDetails>
          Premier League • Matchday 12<br />
          Stamford Bridge, London<br />
          88' • Live
        </MatchDetails>
      </MatchInfoPanel>

      <FormationPanel>
        <FormationTitle>Formation (4-2-3-1)</FormationTitle>
        <FormationGrid>
          <FieldLines />
          
          {/* Home team players */}
          {homeFormation.map((player, index) => (
            <PlayerDot
              key={`home-${index}`}
              team="home"
              x={player.x}
              y={player.y}
              title={`Player ${player.number}`}
            >
              {player.number}
            </PlayerDot>
          ))}
          
          {/* Away team players */}
          {awayFormation.map((player, index) => (
            <PlayerDot
              key={`away-${index}`}
              team="away"
              x={player.x}
              y={player.y}
              title={`Player ${player.number}`}
            >
              {player.number}
            </PlayerDot>
          ))}
        </FormationGrid>
      </FormationPanel>
    </SidebarContainer>
  );
};

export default RightSidebarComponent;
