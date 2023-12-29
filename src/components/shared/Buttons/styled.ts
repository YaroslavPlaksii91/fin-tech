import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';

export const StyledActionMenuButton = styled(IconButton)(({ theme }) => ({
  borderRadius: '4px',
  width: '20px',
  height: '20px',
  right: '16px',
  '&:hover': {
    background: theme.palette.gray,
    color: theme.palette.white
  }
}));
