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
    { label: 'Run Rate', value: '12.24 RPO' },
    { label: 'Boundaries', value: '18 (4s: 14, 6s: 4)' },
    { label: 'Strike Rate', value: '148.5%' },
    { label: 'Wickets Lost', value: '3' },
    { label: 'Partnerships', value: '2 > 50 runs' },
    { label: 'Extras', value: '12 (wd: 7, nb: 3, b: 2)' }
  ];

  const homeTeamPlayers = [
    { name: 'Rohit Sharma', position: 'Opener', number: '45', rating: '8.5', status: 'Batting', runs: '67*' },
    { name: 'Virat Kohli', position: 'Top Order', number: '18', rating: '8.8', status: 'Batting', runs: '89*' },
    { name: 'KL Rahul', position: 'WK-Bat', number: '1', rating: '7.2', status: 'Out', runs: '23' },
    { name: 'Suryakumar Yadav', position: 'Middle Order', number: '63', rating: '8.0', status: 'Next', runs: '-' },
    { name: 'Hardik Pandya', position: 'All-rounder', number: '33', rating: '7.8', status: 'Next', runs: '-' },
    { name: 'Ravindra Jadeja', position: 'All-rounder', number: '8', rating: '7.5', status: 'Next', runs: '-' },
    { name: 'MS Dhoni', position: 'WK-Bat', number: '7', rating: '7.9', status: 'Next', runs: '-' },
    { name: 'Bhuvneshwar Kumar', position: 'Bowler', number: '15', rating: '7.3', status: 'Next', runs: '-' },
    { name: 'Jasprit Bumrah', position: 'Bowler', number: '93', rating: '8.2', status: 'Next', runs: '-' },
    { name: 'Yuzvendra Chahal', position: 'Spinner', number: '3', rating: '7.6', status: 'Next', runs: '-' },
    { name: 'Mohammed Shami', position: 'Bowler', number: '11', rating: '7.4', status: 'Next', runs: '-' }
  ];

  const awayTeamPlayers = [
    { name: 'David Warner', position: 'Opener', number: '31', rating: '7.8', status: 'Bowling', overs: '0-0-0-0' },
    { name: 'Steve Smith', position: 'Top Order', number: '49', rating: '8.3', status: 'Bowling', overs: '0-0-0-0' },
    { name: 'Glenn Maxwell', position: 'All-rounder', number: '32', rating: '7.9', status: 'Bowling', overs: '2-0-18-0' },
    { name: 'Marcus Stoinis', position: 'All-rounder', number: '0', rating: '7.2', status: 'Bowling', overs: '0-0-0-0' },
    { name: 'Josh Inglis', position: 'WK-Bat', number: '17', rating: '7.1', status: 'Bowling', overs: '0-0-0-0' },
    { name: 'Tim David', position: 'Middle Order', number: '46', rating: '7.4', status: 'Bowling', overs: '0-0-0-0' },
    { name: 'Pat Cummins', position: 'Bowler', number: '30', rating: '8.5', status: 'Bowling', overs: '3-0-28-1' },
    { name: 'Mitchell Starc', position: 'Bowler', number: '56', rating: '8.1', status: 'Bowler', overs: '2.2-0-21-2' },
    { name: 'Josh Hazlewood', position: 'Bowler', number: '5', rating: '7.7', status: 'Bowling', overs: '3-0-22-0' },
    { name: 'Adam Zampa', position: 'Spinner', number: '1', rating: '7.8', status: 'Bowling', overs: '4-0-35-0' },
    { name: 'Kane Richardson', position: 'Bowler', number: '4', rating: '7.0', status: 'Bowling', overs: '1-0-12-0' }
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
              India (Batting)
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
              Australia (Bowling)
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
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted-text)', marginTop: '2px' }}>
                  {player.runs ? `Runs: ${player.runs}` : player.overs ? `${player.overs}` : player.status}
                </div>
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
