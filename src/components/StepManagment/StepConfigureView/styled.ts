import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 1,
  background: theme.palette.white,
  overflowY: 'scroll'
}));
