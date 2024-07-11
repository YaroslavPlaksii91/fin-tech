import { Paper, TableContainer, TableRow } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { blueGrey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { DataGridPremium, gridClasses } from '@mui/x-data-grid-premium';

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

export const StyledDataGridPremium = styled(DataGridPremium)(() => ({
  border: 'transparent',

  [`& .${gridClasses.pinnedRows} .${gridClasses.row}`]: {
    fontWeight: 500,
    color: theme.palette.text.primary,
    backgroundColor: 'var(--unstable_DataGrid-overlayBackground)',
    '&:last-child': { borderBottom: 0 },
    [`&.even .${gridClasses.cell}`]: {
      backgroundColor: blueGrey[50]
    },
    [`&.odd .${gridClasses.cell}`]: {
      backgroundColor: blueGrey[50]
    }
  },
  [`& .${gridClasses.row}`]: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: 'var(--unstable_DataGrid-overlayBackground)',
    [`&.even .${gridClasses.cell}`]: {
      backgroundColor: theme.palette.common.white
    },

    [`&.odd .${gridClasses.cell}`]: {
      backgroundColor: theme.palette.background.default
    }
  },
  [`& .${gridClasses.columnHeader}`]: {
    backgroundColor: theme.palette.background.default,

    '&:focus-within': {
      outline: 'transparent'
    }
  },
  [`& .${gridClasses.cell}`]: {
    outline: 'transparent',
    border: 'transparent',

    '&:focus-within': {
      outline: 'transparent',
      border: 'transparent'
    }
  },
  [`& .${gridClasses['cell--pinnedRight']}`]: {
    boxShadow: 'rgba(0, 0, 0, 0.21) -2px 0px 4px -2px'
  },
  [`& .${gridClasses['columnHeader--pinnedRight']}`]: {
    boxShadow: 'rgba(0, 0, 0, 0.21) -2px 0px 4px -2px'
  },
  [`& .${gridClasses.footerCell}`]: {
    fontWeight: 500,
    color: theme.palette.text.primary
  }
}));
