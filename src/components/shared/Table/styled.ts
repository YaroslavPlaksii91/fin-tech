import { Paper, TableContainer, TableRow } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: 'rgba(248, 249, 251, 0.6)',
  borderBottom: '1px solid rgba(209, 217, 226, 0.4)',
  borderRight: '1px solid rgba(209, 217, 226, 0.4)',
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.whiteSmoke
  }
}));

export const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td': {
    borderBottom: 'none'
  },
  '& td:last-child': {
    borderRight: 'none'
  },
  '& th:last-child': {
    borderRight: 'none'
  }
}));

export const StyledTableContainer = styled(TableContainer)(() => ({
  maxHeight: `calc(100vh - 450px)`
}));

export const StyledPaper = styled(Paper)(() => ({
  width: '100%',
  overflow: 'hidden',
  marginBottom: '16px'
}));
