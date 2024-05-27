import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StepContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  overflowY: 'scroll',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  background: theme.palette.background.default
}));

export const StepContentWrapper = styled(Box)(() => ({
  padding: '16px 24px',
  flexGrow: 1
}));
