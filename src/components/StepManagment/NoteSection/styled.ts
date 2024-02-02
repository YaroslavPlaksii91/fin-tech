import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const StyledOverlapArea = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1
}));

export const StyledNestedArea = styled(Box)(() => ({
  position: 'relative',
  zIndex: 0
}));
