import { TableContainer, TableRow } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { blueGrey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { DataGridPremium, gridClasses } from '@mui/x-data-grid-premium';

export const StyledTableCell = styled(TableCell)(
  ({
    theme: {
      palette: { divider, background }
    }
  }) => ({
    backgroundColor: 'rgba(248, 249, 251)',
    borderBottom: `1px solid ${divider}`,
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: background.default
    }
  })
);

export const StyledTableRow = styled(TableRow)<{ parity?: 'odd' | 'even' }>(
  ({
    parity,
    theme: {
      palette: { background, common }
    }
  }) => ({
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
        background: parity === 'even' ? common.white : background.default
      })
    }
  })
);

export const StyledTableContainer = styled(TableContainer)(() => ({
  maxHeight: `calc(100vh - 450px)`
}));

export const StyledDataGridPremium = styled(DataGridPremium)(
  ({
    theme: {
      palette: { text, common, background }
    }
  }) => ({
    border: 'transparent',

    [`& .${gridClasses.pinnedRows} .${gridClasses.row}`]: {
      fontWeight: 500,
      color: text.primary,
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
      borderBottom: 'transparent',
      backgroundColor: 'var(--unstable_DataGrid-overlayBackground)',
      [`&.even .${gridClasses.cell}`]: {
        backgroundColor: common.white
      },

      [`&.odd .${gridClasses.cell}`]: {
        backgroundColor: background.default
      }
    },
    [`& .${gridClasses.columnHeader}`]: {
      backgroundColor: background.default,

      '&:focus-within': {
        outline: 'transparent'
      }
    },
    [`& .${gridClasses.cell}:focus`]: {
      outline: 'none'
    },
    [`& .${gridClasses['cell--pinnedRight']}`]: {
      boxShadow: 'rgba(0, 0, 0, 0.21) -2px 0px 4px -2px'
    },
    [`& .${gridClasses['columnHeader--pinnedRight']}`]: {
      boxShadow: 'rgba(0, 0, 0, 0.21) -2px 0px 4px -2px'
    },
    [`& .${gridClasses.footerCell}`]: {
      fontWeight: 500,
      color: text.primary
    }
  })
);

export const StyledGridOverlay = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%'
});
