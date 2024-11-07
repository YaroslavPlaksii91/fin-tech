import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';

export const StyledInfoIcon = styled(InfoIcon)(({ theme }) => ({
  color: theme.palette.action.active,

  '&:hover': {
    color: theme.palette.info.main,
    cursor: 'pointer'
  }
}));
