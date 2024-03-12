import { Tab, TableContainer, Table, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  padding: '12px 16px 12px 0px',
  color: `${theme.palette.gray} !important`
}));

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
