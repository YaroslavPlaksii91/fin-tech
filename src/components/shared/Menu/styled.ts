import { styled } from '@mui/material/styles';
import Menu from '@mui/material/Menu';

export const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none'
  }
}));
