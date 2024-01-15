import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import { StyledListItemText } from '@components/shared/List/styled';

export const StyledStepItem = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
}));

export const StyledStepItemText = styled(StyledListItemText)(() => ({
  '.MuiTypography-root': {
    fontWeight: '600'
  }
}));
