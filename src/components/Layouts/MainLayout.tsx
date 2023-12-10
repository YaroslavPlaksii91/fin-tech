import { Box, Divider, Stack, Typography } from '@mui/material';
import React from 'react';

import {
  StyledDivider,
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
  header: React.ReactNode | string;
  children: React.ReactNode;
}

const SideNavContainer: React.FC<SideNavContainerProps> = ({
  children,
  header,
  footer
}) => (
  <StyledSideNavContainer borderTop="3px" component="nav">
    {typeof header == 'string' ? (
      <Typography pl={2} pr={2} variant="h5">
        {header}
      </Typography>
    ) : (
      header
    )}
    <StyledDivider />
    {children}
    <StyledSideNavFooter component="footer">
      <Divider />
      <Stack pt={2} pr={2} pl={2}>
        {footer}
      </Stack>
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
