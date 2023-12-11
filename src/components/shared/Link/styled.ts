import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';

export const StyledNavLink = styled(NavLink)(({ theme }) => ({
  color: theme.palette.gray,
  textDecoration: 'none',
  '&.active': {
    color: theme.palette.gray,
    fontWeight: 'bold'
  }
}));

export const StyledNavigateNext = styled(Typography)(({ theme }) => ({
  color: theme.palette.gray
}));
