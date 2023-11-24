import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const DRAWER_WIDTH = 276;
const HEADER_HAEIGHT = '64px';

export const StyledLayoutContainer = styled(Box)(() => ({
  height: `calc(100vh - ${HEADER_HAEIGHT})`
}));

export const StyledSideNavContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: DRAWER_WIDTH,
  background: theme.palette.lightGray,
  borderTop: '1px',
  borderColor: theme.palette.divider,
  padding: '20px 0px'
}));

export const StyledSideNavFooter = styled(Box)(() => ({
  marginTop: 'auto'
}));
