import React from 'react';
import styled from 'styled-components';

const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: var(--primary-bg);
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main sidebar-right"
    "footer footer footer";
  grid-template-columns: 280px 1fr 320px;
  grid-template-rows: 60px 1fr 100px;
  overflow: hidden;
`;

const HeaderSection = styled.header`
  grid-area: header;
  height: 60px;
  background: var(--secondary-bg);
  border-bottom: 1px solid var(--border-gray);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftSidebar = styled.aside`
  grid-area: sidebar;
  width: 280px;
  background: var(--secondary-bg);
  border-right: 1px solid var(--border-gray);
  padding: 20px;
  overflow-y: auto;
`;

const MainVideoSection = styled.main`
  grid-area: main;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const RightSidebar = styled.aside`
  grid-area: sidebar-right;
  width: 320px;
  background: var(--secondary-bg);
  border-left: 1px solid var(--border-gray);
  padding: 20px;
  overflow-y: auto;
`;

const FooterSection = styled.footer`
  grid-area: footer;
  height: 100px;
  background: var(--secondary-bg);
  border-top: 1px solid var(--border-gray);
  padding: 20px;
  display: flex;
  gap: 20px;
`;

// PUBLIC_INTERFACE
const LayoutContainer = ({ 
  headerContent, 
  leftSidebarContent, 
  mainContent, 
  rightSidebarContent, 
  footerContent 
}) => {
  /**
   * Main layout container component that creates the exact grid structure
   * from the design specification with proper dimensions and spacing.
   */
  return (
    <MainContainer>
      <HeaderSection>
        {headerContent}
      </HeaderSection>
      
      <LeftSidebar>
        {leftSidebarContent}
      </LeftSidebar>
      
      <MainVideoSection>
        {mainContent}
      </MainVideoSection>
      
      <RightSidebar>
        {rightSidebarContent}
      </RightSidebar>
      
      <FooterSection>
        {footerContent}
      </FooterSection>
    </MainContainer>
  );
};

export default LayoutContainer;
