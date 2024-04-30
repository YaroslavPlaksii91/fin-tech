import { Table, Paper, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';

import { theme } from '../../../themeConfig';

export const StyledTable = styled(Table)(() => ({
  borderRight: '1px solid rgba(209, 217, 226, 0.4)'
}));

export const StyledPaper = styled(Paper)(() => ({
  overflow: 'hidden',
  marginTop: '16px',
  border: `1px solid ${theme.palette.divider}`
}));

export const StyledStack = styled(Stack)(() => ({
  cursor: 'pointer'
}));

export const StyledNavLink = styled(NavLink)(
  ({
    theme: {
      typography: { body1 }
    }
  }) => ({
    ...body1,
    color: '#0288D1'
  })
);
