import React from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  background: #d32f2f;
  border: 1px solid #f44336;
  border-radius: 8px;
  width: 280px;
  padding: 16px;
  margin: 8px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    filter: brightness(1.1);
  }
`;

const Header = styled.div`
  background: rgba(211, 47, 47, 0.8);
  color: #ffffff;
  font-family: Arial, sans-serif;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 12px;
  text-align: center;
  margin: -16px -16px 16px -16px;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #f44336;
`;

const FormationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 16px 8px;
  justify-items: center;
  align-items: center;
  min-height: 240px;
  padding: 8px 0;
`;

const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const PlayerCircle = styled.div`
  width: 24px;
  height: 24px;
  background: #ffffff;
  border: 2px solid #f44336;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 600;
  color: #d32f2f;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
`;

const PlayerName = styled.div`
  font-size: 10px;
  font-weight: 500;
  color: #ffffff;
  text-align: center;
  max-width: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
`;

// PUBLIC_INTERFACE
const AustraliaTeamPanel = () => {
  /**
   * Australia cricket team panel component displaying team formation
   * with exact styling specifications from design notes
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
      <FormationGrid>
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
      </FormationGrid>
    </PanelContainer>
  );
};

export default AustraliaTeamPanel;
