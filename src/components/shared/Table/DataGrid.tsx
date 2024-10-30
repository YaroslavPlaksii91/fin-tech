import { Box, SxProps, Theme } from '@mui/material';
import {
  DataGridPremiumProps,
  GridRowClassNameParams
} from '@mui/x-data-grid-premium';

import { StyledDataGridPremium } from './styled';
import CustomNoResultsOverlay from './CustomNoResultsOverlay';

import { TABLE } from '@constants/themeConstants';

const getRowClassName = (params: GridRowClassNameParams) =>
  params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd';

interface DataGridProps extends DataGridPremiumProps {
  wrapperSx?: SxProps<Theme>;
}

const DataGrid = ({
  slots,
  sx,
  wrapperSx,
  disableColumnMenu = true,
  disableAutosize = true,
  disableRowSelectionOnClick = true,
  rows = [],
  ...props
}: DataGridProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '200px',
      width: '100%',
      ...wrapperSx
    }}
  >
    <StyledDataGridPremium
      disableColumnMenu={disableColumnMenu}
      disableAutosize={disableAutosize}
      disableRowSelectionOnClick={disableRowSelectionOnClick}
      columnHeaderHeight={TABLE.COLUMN_HEIGHT}
      rowHeight={TABLE.ROW_HEIGHT}
      rows={rows}
      getRowClassName={getRowClassName}
      sx={{ height: TABLE.HEIGHT, ...sx }}
      slots={{ noRowsOverlay: CustomNoResultsOverlay, ...slots }}
      {...props}
    />
  </Box>
);

export default DataGrid;
