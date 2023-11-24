import { Box, Divider, Typography } from '@mui/material';
import React from 'react';

import {
  StyledLayoutContainer,
  StyledSideNavContainer,
  StyledSideNavFooter
} from './styled';

interface LayoutContainerProps {
  children: React.ReactNode;
}
const LayoutContainer: React.FC<LayoutContainerProps> = ({ children }) => (
  <StyledLayoutContainer sx={{ display: 'flex' }}>
    {children}
  </StyledLayoutContainer>
);

interface SideNavContainerProps {
  footer: React.ReactNode;
  title: React.ReactNode | string;
  children: React.ReactNode;
}

const SideNavContainer: React.FC<SideNavContainerProps> = ({
  children,
  title,
  footer
}) => (
  <StyledSideNavContainer component="nav">
    <Typography variant="h5">{title}</Typography>
    {children}
    <StyledSideNavFooter component="footer">
      <Divider />
      {footer}
    </StyledSideNavFooter>
  </StyledSideNavContainer>
);

interface MainContainerProps {
  children: React.ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({ children }) => (
  <Box sx={{ width: '100%', height: '100%' }} component="main">
    {children}
  </Box>
);

export { SideNavContainer, LayoutContainer, MainContainer };
