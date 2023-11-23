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
