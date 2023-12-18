import { styled } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';

const NormalizeLink = styled(NavLink)(({ theme }) => ({
  color: theme.palette.gray,
  textDecoration: 'none'
}));

export const StyledNavLink = styled(NormalizeLink)(({ theme }) => ({
  '&.active': {
    color: theme.palette.gray,
    fontWeight: 'bold'
  }
}));

export const StyledListItemNavLink = styled(NormalizeLink)(({ theme }) => ({
  display: 'block',
  '&.active': {
    background: theme.palette.secondary.main
  }
}));

export const StyledBorderNavLink = styled(NormalizeLink)(({ theme }) => ({
  display: 'block',
  '&.active': {
    borderLeft: `3px solid ${theme.palette.gray}`
  }
}));
