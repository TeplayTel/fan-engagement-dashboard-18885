import React, { useState } from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const StatisticsPanel = styled.div`
  margin-bottom: 30px;
`;

const PanelHeader = styled.h3`
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  color: var(--primary-text);
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-gray);
  margin-top: 0;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: var(--font-base);
`;

const StatLabel = styled.span`
  color: var(--secondary-text);
  font-weight: var(--font-normal);
`;

const StatValue = styled.span`
  color: var(--primary-text);
  font-weight: var(--font-semibold);
`;

const TeamLineupSection = styled.div`
  margin-bottom: 30px;
`;

const PlayerCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PlayerCard = styled.div`
  background: var(--tertiary-bg);
  border-radius: 6px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--border-gray);
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--hover-bg);
    border-color: var(--secondary-text);
  }
`;

const PlayerAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: var(--font-bold);
  font-size: var(--font-sm);
`;

const PlayerInfo = styled.div`
  flex: 1;
`;

const PlayerName = styled.div`
  font-size: var(--font-base);
  font-weight: var(--font-medium);
  color: var(--primary-text);
  margin-bottom: 2px;
`;

const PlayerPosition = styled.div`
  font-size: var(--font-sm);
  color: var(--muted-text);
`;

const PlayerRating = styled.div`
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
  color: var(--accent-green);
  background: rgba(40, 167, 69, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
`;

// PUBLIC_INTERFACE
const LeftSidebarComponent = () => {
  /**
   * Left sidebar component containing match statistics and team lineup
   * with exact styling and layout from design specification.
   */
  const [activeTeam, setActiveTeam] = useState('home');

  const matchStats = [
    { label: 'Ball Possession', value: '58% - 42%' },
    { label: 'Shots on Target', value: '7 - 4' },
    { label: 'Corner Kicks', value: '5 - 3' },
    { label: 'Fouls', value: '12 - 8' },
    { label: 'Yellow Cards', value: '2 - 1' },
    { label: 'Offsides', value: '3 - 2' }
  ];

  const homeTeamPlayers = [
    { name: 'Robert Sanchez', position: 'GK', number: '1', rating: '7.2' },
    { name: 'Reece James', position: 'RB', number: '24', rating: '7.8' },
    { name: 'Thiago Silva', position: 'CB', number: '6', rating: '8.1' },
    { name: 'Wesley Fofana', position: 'CB', number: '33', rating: '7.5' },
    { name: 'Ben Chilwell', position: 'LB', number: '21', rating: '7.3' },
    { name: 'Enzo Fernandez', position: 'CM', number: '5', rating: '8.2' },
    { name: 'Moises Caicedo', position: 'CM', number: '25', rating: '7.9' },
    { name: 'Raheem Sterling', position: 'RW', number: '7', rating: '7.6' },
    { name: 'Cole Palmer', position: 'AM', number: '20', rating: '8.5' },
    { name: 'Mykhaylo Mudryk', position: 'LW', number: '10', rating: '7.4' },
    { name: 'Nicolas Jackson', position: 'ST', number: '15', rating: '8.0' }
  ];

  const awayTeamPlayers = [
    { name: 'David Raya', position: 'GK', number: '22', rating: '7.5' },
    { name: 'Ben White', position: 'RB', number: '4', rating: '7.7' },
    { name: 'William Saliba', position: 'CB', number: '2', rating: '8.3' },
    { name: 'Gabriel', position: 'CB', number: '6', rating: '8.0' },
    { name: 'Oleksandr Zinchenko', position: 'LB', number: '35', rating: '7.4' },
    { name: 'Declan Rice', position: 'CDM', number: '41', rating: '8.1' },
    { name: 'Martin Odegaard', position: 'CM', number: '8', rating: '8.7' },
    { name: 'Bukayo Saka', position: 'RW', number: '7', rating: '8.4' },
    { name: 'Kai Havertz', position: 'AM', number: '29', rating: '7.8' },
    { name: 'Gabriel Martinelli', position: 'LW', number: '11', rating: '7.9' },
    { name: 'Gabriel Jesus', position: 'ST', number: '9', rating: '7.6' }
  ];

  const currentPlayers = activeTeam === 'home' ? homeTeamPlayers : awayTeamPlayers;

  return (
    <SidebarContainer>
      <StatisticsPanel>
        <PanelHeader>Match Statistics</PanelHeader>
        {matchStats.map((stat, index) => (
          <StatItem key={index}>
            <StatLabel>{stat.label}</StatLabel>
            <StatValue>{stat.value}</StatValue>
          </StatItem>
        ))}
      </StatisticsPanel>

      <TeamLineupSection>
        <PanelHeader>
          Team Lineup
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={() => setActiveTeam('home')}
              style={{
                background: activeTeam === 'home' ? 'var(--accent-blue)' : 'var(--tertiary-bg)',
                color: 'var(--primary-text)',
                border: '1px solid var(--border-gray)',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: 'var(--font-sm)',
                cursor: 'pointer'
              }}
            >
              Chelsea
            </button>
            <button
              onClick={() => setActiveTeam('away')}
              style={{
                background: activeTeam === 'away' ? 'var(--accent-red)' : 'var(--tertiary-bg)',
                color: 'var(--primary-text)',
                border: '1px solid var(--border-gray)',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: 'var(--font-sm)',
                cursor: 'pointer'
              }}
            >
              Arsenal
            </button>
          </div>
        </PanelHeader>
        
        <PlayerCards>
          {currentPlayers.map((player, index) => (
            <PlayerCard key={index}>
              <PlayerAvatar>
                {player.number}
              </PlayerAvatar>
              <PlayerInfo>
                <PlayerName>{player.name}</PlayerName>
                <PlayerPosition>{player.position}</PlayerPosition>
              </PlayerInfo>
              <PlayerRating>{player.rating}</PlayerRating>
            </PlayerCard>
          ))}
        </PlayerCards>
      </TeamLineupSection>
    </SidebarContainer>
  );
};

export default LeftSidebarComponent;
