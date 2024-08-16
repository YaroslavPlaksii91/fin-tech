import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { ListItem } from '@mui/material';

export const StyledStepItem = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
}));

export const StyledListItem = styled(ListItem)(({ theme: { palette } }) => ({
  borderRadius: '4px',
  paddingLeft: '40px',
  gap: '8px',
  '&.active, &:hover': {
    cursor: 'pointer',
    background: palette.background.default,
    '& .MuiTypography-body2': {
      color: palette.primary.main
    }
  }
}));
