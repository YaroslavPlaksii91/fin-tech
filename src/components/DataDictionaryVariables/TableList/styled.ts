import { Table, Paper, Stack, TableContainer } from '@mui/material';
import { styled } from '@mui/material/styles';

import { theme } from '@theme';

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

export const StyledTableContainer = styled(TableContainer)(() => ({
  display: 'flex',
  overflowX: 'scroll'
}));
