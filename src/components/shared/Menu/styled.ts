import { styled } from '@mui/material/styles';
import Menu from '@mui/material/Menu';

export const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    border: `1px solid ${theme.palette.divider}`,
    // boxShadow: 'none',
    boxShadow: 'box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.05)',
    borderRadius: '12px'
  }
}));
