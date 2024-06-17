import React from 'react';
import { Box } from '@mui/material';

import { StyledLayoutContainer } from './styled';

import LoadingFullscreen from '@components/shared/LoadingFullscreen';
import { useLoading } from '@contexts/LoadingContext';

interface LayoutContainerProps {
  children: React.ReactNode;
}
const LayoutContainer: React.FC<LayoutContainerProps> = ({ children }) => {
  const { loading } = useLoading();

  return (
    <StyledLayoutContainer>
      {loading && <LoadingFullscreen />}
      {children}
    </StyledLayoutContainer>
  );
};
interface MainContainerProps {
  children: React.ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({ children }) => (
  <Box
    sx={{
      overflow: 'auto',
      width: '100%',
      height: '100%',
      position: 'relative'
    }}
    component="main"
  >
    {children}
  </Box>
);

export { LayoutContainer, MainContainer };
