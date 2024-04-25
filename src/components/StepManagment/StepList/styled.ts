import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { ListItem } from '@mui/material';

export const StyledStepItem = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  paddingLeft: '8px'
}));

export const StyledListItem = styled(ListItem)(({ theme: { palette } }) => ({
  borderRadius: '4px',
  '&.active, &:hover': {
    cursor: 'pointer',
    background: palette.amber,
    color: palette.primary.main
  }
}));
