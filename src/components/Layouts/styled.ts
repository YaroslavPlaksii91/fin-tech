import { styled } from '@mui/material/styles';
import { Box, Divider } from '@mui/material';

import { HEADER_HEIGHT, DRAWER_WIDTH } from '@constants/themeConstants';

export const StyledLayoutContainer = styled(Box)(() => ({
  display: 'flex',
  height: `calc(100vh - ${HEADER_HEIGHT}px)`
}));

export const StyledSideNavContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: DRAWER_WIDTH,
  background: theme.palette.lightGray,
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: '20px 0px 16px'
}));

export const StyledSideNavFooter = styled(Box)(() => ({
  marginTop: 'auto'
}));

export const StyledDivider = styled(Divider)(() => ({
  marginTop: '14px',
  marginBottom: '16px'
}));
