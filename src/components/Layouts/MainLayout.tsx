import React from 'react';
import { Box } from '@mui/material';

import { StyledLayoutContainer } from './styled';

import LoadingFullscreen from '@components/shared/LoadingFullscreen';
import { useLoading } from '@contexts/LoadingContext';

interface LayoutContainerProps {
  children: React.ReactNode;
  sx?: React.CSSProperties;
}
const LayoutContainer: React.FC<LayoutContainerProps> = ({
  children,
  ...props
}) => {
  const { loading } = useLoading();

  return (
    <>
      {loading && <LoadingFullscreen />}
      <StyledLayoutContainer {...props}>{children}</StyledLayoutContainer>
    </>
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
