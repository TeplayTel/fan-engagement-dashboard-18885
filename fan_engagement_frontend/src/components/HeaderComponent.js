import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoBrand = styled.div`
  font-size: var(--font-xl);
  font-weight: var(--font-bold);
  color: var(--primary-text);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavigationMenu = styled.nav`
  display: flex;
  gap: 30px;
  align-items: center;
`;

const NavItem = styled.button`
  background: none;
  border: none;
  font-size: var(--font-base);
  color: var(--secondary-text);
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary-text);
    background: var(--hover-bg);
  }
  
  &.active {
    color: var(--primary-text);
    background: var(--accent-blue);
  }
`;

const UserControls = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const ControlButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--tertiary-bg);
  border: 1px solid var(--border-gray);
  color: var(--primary-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--hover-bg);
    border-color: var(--secondary-text);
  }
`;

// PUBLIC_INTERFACE
const HeaderComponent = () => {
  /**
   * Header component with logo, navigation menu, and user controls
   * following exact design specifications for positioning and styling.
   */
  return (
    <HeaderContainer>
      <LogoBrand>
        <span>⚽</span>
        Fan Engagement
      </LogoBrand>
      
      <NavigationMenu>
        <NavItem className="active">Live</NavItem>
        <NavItem>Matches</NavItem>
        <NavItem>Stats</NavItem>
        <NavItem>Teams</NavItem>
      </NavigationMenu>
      
      <UserControls>
        <ControlButton title="Notifications">
          🔔
        </ControlButton>
        <ControlButton title="Settings">
          ⚙️
        </ControlButton>
        <ControlButton title="User Profile">
          👤
        </ControlButton>
      </UserControls>
    </HeaderContainer>
  );
};

export default HeaderComponent;
