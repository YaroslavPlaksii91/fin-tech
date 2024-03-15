import { TableContainer, Table, Paper } from '@mui/material';
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
  marginTop: '16px'
}));
