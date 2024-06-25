import { useMemo } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import getColumns from './columns';
import { getFormattedData, getFormattedRows } from './utils';
import { StyledDataGridPremium } from './styled';

import { LeadRequestsReport } from '@domain/leadRequestsReports';

interface DetailsProps {
  data: LeadRequestsReport;
  handleClose: () => void;
}

const Details = ({ data, handleClose }: DetailsProps) => {
  const formattedData = getFormattedData(data);
  const rows = getFormattedRows(formattedData);

  const columns = useMemo(
    () =>
      getColumns({
        handleScores: () => null,
        handleRequestRespoonse: () => null
      }),
    []
  );

  return (
    <Box sx={{ padding: '8px 24px' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px'
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ marginRight: '8px', padding: '2px' }}
        >
          <ChevronRightIcon sx={{ fontSize: '28px' }} />
        </IconButton>
        <Typography variant="h6">Details</Typography>
      </Box>
      <StyledDataGridPremium
        hideFooter
        autoHeight
        disableColumnReorder
        disableColumnMenu
        showCellVerticalBorder
        showColumnVerticalBorder
        columnHeaderHeight={39}
        rowHeight={52}
        columns={columns}
        rows={rows}
      />
    </Box>
  );
};

export default Details;
