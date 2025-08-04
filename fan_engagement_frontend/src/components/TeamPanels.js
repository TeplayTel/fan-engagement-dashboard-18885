import React from 'react';
import styled from 'styled-components';
import IndiaTeamPanel from './IndiaTeamPanel';
import AustraliaTeamPanel from './AustraliaTeamPanel';

const PanelsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 10;
  
  @media (max-width: 1024px) {
    position: relative;
    top: auto;
    right: auto;
    margin: 20px 0;
  }
  
  @media (max-width: 768px) {
    align-items: center;
    
    > * {
      width: 250px;
    }
  }
`;

// PUBLIC_INTERFACE
const TeamPanels = ({ currentMatch }) => {
  /**
   * Container component for India and Australia team panels
   * Displays both panels with proper positioning and responsive behavior
   */
  
  // Only show panels for India vs Australia matches
  if (!currentMatch || 
      !(currentMatch.home?.name?.toLowerCase().includes('india') || 
        currentMatch.away?.name?.toLowerCase().includes('india') ||
        currentMatch.home?.name?.toLowerCase().includes('australia') || 
        currentMatch.away?.name?.toLowerCase().includes('australia'))) {
    return null;
  }

  return (
    <PanelsWrapper>
      <IndiaTeamPanel />
      <AustraliaTeamPanel />
    </PanelsWrapper>
  );
};

export default TeamPanels;
