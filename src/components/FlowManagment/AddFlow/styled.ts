import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledDiv = styled('div')(({ theme: { palette } }) => ({
  borderRadius: '6px',
  '&:hover': {
    background: palette.sidebarItemHover
  }
}));

export const StyledButton = styled(Button)(() => ({
  '&:hover': {
    background: 'none'
  }
}));
