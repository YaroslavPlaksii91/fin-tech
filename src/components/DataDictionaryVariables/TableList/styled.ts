import { TableContainer, Table, Paper, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledTableContainer = styled(TableContainer)(() => ({
  display: 'flex',
  overflowX: 'scroll',
  flexDirection: 'column'
}));

export const StyledTable = styled(Table)(() => ({
  borderRight: '1px solid rgba(209, 217, 226, 0.4)'
}));

export const StyledPaper = styled(Paper)(() => ({
  overflow: 'hidden',
  marginTop: '16px'
}));

export const StyledStack = styled(Stack)(() => ({
  textDecoration: 'underline',
  cursor: 'pointer'
}));
