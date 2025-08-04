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
    gap: 12px;
    
    > * {
      width: 250px;
      padding: 12px;
    }
  }
`;

// PUBLIC_INTERFACE
const TeamPanels = ({ currentMatch }) => {
  /**
   * Brand new container component for India and Australia team panels
   * Displays both panels with exact positioning and responsive behavior
   * as specified in the design notes for pixel-perfect implementation.
   */
  
  // Always show panels for cricket dashboard (India vs Australia)
  return (
    <PanelsWrapper>
      <IndiaTeamPanel />
      <AustraliaTeamPanel />
    </PanelsWrapper>
  );
};

export default TeamPanels;
