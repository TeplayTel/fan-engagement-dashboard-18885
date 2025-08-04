import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 20px;
`;

const MiniStatCards = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
`;

const StatCard = styled.div`
  background: var(--tertiary-bg);
  border-radius: 6px;
  padding: 15px;
  flex: 1;
  text-align: center;
  border: 1px solid var(--border-gray);
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--hover-bg);
    border-color: var(--secondary-text);
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div`
  width: 24px;
  height: 24px;
  margin: 0 auto 8px;
  color: var(--accent-blue);
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatLabel = styled.div`
  font-size: var(--font-sm);
  color: var(--secondary-text);
  margin-bottom: 4px;
  font-weight: var(--font-medium);
`;

const StatValue = styled.div`
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--primary-text);
  letter-spacing: -0.025em;
`;

// PUBLIC_INTERFACE
const FooterComponent = () => {
  /**
   * Footer component with mini statistics cards showing key match metrics
   * with exact styling and layout from design specification.
   */
  
  const stats = [
    {
      icon: '⚽',
      label: 'Goals',
      value: '3'
    },
    {
      icon: '👥',
      label: 'Viewers',
      value: '45.2K'
    },
    {
      icon: '💬',
      label: 'Comments',
      value: '1.8K'
    },
    {
      icon: '👍',
      label: 'Reactions',
      value: '12.5K'
    },
    {
      icon: '⏱️',
      label: 'Time',
      value: '88\''
    }
  ];

  return (
    <FooterContainer>
      <MiniStatCards>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatIcon>{stat.icon}</StatIcon>
            <StatLabel>{stat.label}</StatLabel>
            <StatValue>{stat.value}</StatValue>
          </StatCard>
        ))}
      </MiniStatCards>
    </FooterContainer>
  );
};

export default FooterComponent;
