import React from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  background: #1a237e;
  border: 1px solid #3949ab;
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
  background: rgba(26, 35, 126, 0.8);
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
  border-bottom: 1px solid #3949ab;
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
  border: 2px solid #2196f3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 600;
  color: #1a237e;
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
const IndiaTeamPanel = () => {
  /**
   * India cricket team panel component displaying team formation
   * with exact styling specifications from design notes
   */
  
  const indianPlayers = [
    { name: 'Rohit', position: { gridColumn: 2, gridRow: 1 }, role: 'captain' },
    { name: 'Gill', position: { gridColumn: 3, gridRow: 1 }, role: 'batsman' },
    { name: 'Kohli', position: { gridColumn: 1, gridRow: 2 }, role: 'batsman' },
    { name: 'Shreyas', position: { gridColumn: 2, gridRow: 2 }, role: 'batsman' },
    { name: 'Pant', position: { gridColumn: 4, gridRow: 2 }, role: 'keeper' },
    { name: 'Hardik', position: { gridColumn: 1, gridRow: 3 }, role: 'allrounder' },
    { name: 'Jadeja', position: { gridColumn: 3, gridRow: 3 }, role: 'allrounder' },
    { name: 'Bumrah', position: { gridColumn: 4, gridRow: 3 }, role: 'bowler' },
    { name: 'Kuldeep', position: { gridColumn: 1, gridRow: 4 }, role: 'bowler' },
    { name: 'Shami', position: { gridColumn: 2, gridRow: 4 }, role: 'bowler' },
    { name: 'Siraj', position: { gridColumn: 4, gridRow: 4 }, role: 'bowler' }
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
      <Header>INDIA</Header>
      <FormationGrid>
        {indianPlayers.map((player, index) => (
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

export default IndiaTeamPanel;
