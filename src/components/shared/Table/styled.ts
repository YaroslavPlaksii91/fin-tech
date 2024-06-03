import { Paper, TableContainer, TableRow } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

import { theme } from '@theme';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: 'rgba(248, 249, 251)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.background.default
  }
}));

export const StyledTableRow = styled(TableRow)<{ parity?: 'odd' | 'even' }>(
  ({ parity }) => ({
    '&:last-child td': {
      borderBottom: 'none'
    },
    '& td:last-child': {
      borderRight: 'none'
    },
    '& th:last-child': {
      borderRight: 'none'
    },
    '& > td': {
      ...(parity && {
        background:
          parity === 'even'
            ? theme.palette.background.default
            : theme.palette.common.white
      })
    }
  })
);

export const StyledTableContainer = styled(TableContainer)(() => ({
  maxHeight: `calc(100vh - 450px)`
}));

export const StyledPaper = styled(Paper)(() => ({
  width: '100%',
  overflow: 'hidden',
  marginBottom: '8px',
  border: `1px solid ${theme.palette.divider}`
}));
