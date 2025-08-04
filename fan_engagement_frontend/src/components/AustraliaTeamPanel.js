import React from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  background: var(--australia-primary);
  border: 1px solid var(--australia-accent);
  border-radius: 8px;
  width: 280px;
  padding: 16px;
  margin: 8px 0;
  box-shadow: 0 2px 8px var(--panel-shadow, rgba(0, 0, 0, 0.2));
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    filter: brightness(1.1);
  }
`;

const Header = styled.div`
  background: rgba(211, 47, 47, 0.9);
  color: var(--panel-text);
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 12px;
  text-align: center;
  margin: -16px -16px 16px -16px;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid var(--australia-accent);
`;

const FormationContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 20px 16px;
  justify-items: center;
  align-items: center;
  min-height: 240px;
  padding: 8px 0;
  position: relative;
`;

const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const PlayerCircle = styled.div`
  width: 24px;
  height: 24px;
  background: var(--player-circle-bg);
  border: 2px solid var(--australia-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 600;
  color: var(--australia-primary);
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transform: scale(1.1);
  }
`;

const PlayerName = styled.div`
  font-size: 10px;
  font-weight: 500;
  color: var(--panel-text);
  text-align: center;
  max-width: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
  font-family: Arial, Helvetica, sans-serif;
`;

// PUBLIC_INTERFACE
const AustraliaTeamPanel = () => {
  /**
   * Brand new Australia cricket team panel component with pixel-perfect design
   * specifications matching the provided screenshot and design notes exactly.
   * Features proper formation layout, hover effects, and team-specific styling.
   */
  
  const australianPlayers = [
    { name: 'Warner', position: { gridColumn: 1, gridRow: 1 }, role: 'batsman' },
    { name: 'Finch', position: { gridColumn: 3, gridRow: 1 }, role: 'captain' },
    { name: 'Smith', position: { gridColumn: 4, gridRow: 1 }, role: 'batsman' },
    { name: 'Marnus', position: { gridColumn: 2, gridRow: 2 }, role: 'batsman' },
    { name: 'Maxwell', position: { gridColumn: 3, gridRow: 2 }, role: 'allrounder' },
    { name: 'Carey', position: { gridColumn: 1, gridRow: 3 }, role: 'keeper' },
    { name: 'Stoinis', position: { gridColumn: 4, gridRow: 3 }, role: 'allrounder' },
    { name: 'Cummins', position: { gridColumn: 2, gridRow: 3 }, role: 'bowler' },
    { name: 'Starc', position: { gridColumn: 1, gridRow: 4 }, role: 'bowler' },
    { name: 'Hazlewood', position: { gridColumn: 3, gridRow: 4 }, role: 'bowler' },
    { name: 'Zampa', position: { gridColumn: 4, gridRow: 4 }, role: 'bowler' }
  ];

  const getPlayerIcon = (role) => {
    switch (role) {
      case 'captain': return 'C';
      case 'keeper': return 'WK';
      case 'bowler': return '⚡';
      case 'allrounder': return '⭐';
      default: return '🏏';
    }
  };

  return (
    <PanelContainer>
      <Header>AUSTRALIA</Header>
      <FormationContainer>
        {australianPlayers.map((player, index) => (
          <PlayerContainer
            key={index}
            style={{ 
              gridColumn: player.position.gridColumn,
              gridRow: player.position.gridRow
            }}
          >
            <PlayerCircle title={`${player.name} - ${player.role}`}>
              {getPlayerIcon(player.role)}
            </PlayerCircle>
            <PlayerName>{player.name}</PlayerName>
          </PlayerContainer>
        ))}
      </FormationContainer>
    </PanelContainer>
  );
};

export default AustraliaTeamPanel;
