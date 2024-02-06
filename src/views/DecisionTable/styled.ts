import { Paper, TableContainer, Table, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledTableContainer = styled(TableContainer)(() => ({
  display: 'flex',
  overflowX: 'scroll'
}));

export const StyledTable = styled(Table)(() => ({
  borderRight: '1px solid rgba(209, 217, 226, 0.4)'
}));

export const StyledPaper = styled(Paper)(() => ({
  overflow: 'hidden',
  margin: '16px'
}));

export const StyledStack = styled(Stack)(() => ({
  display: 'flex',
  height: '40px',
  alignItems: 'center',
  justifyContent: 'center'
}));
