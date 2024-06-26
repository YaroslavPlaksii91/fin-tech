import { useCallback, useMemo, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { GridRowParams } from '@mui/x-data-grid-premium';

import getColumns from './columns';
import { getFormattedData, getFormattedRows } from './utils';
import { StyledDataGridPremium } from './styled';
import { RowData } from './types';
import Scores from './Scores';

import { LeadRequestsReport } from '@domain/leadRequestsReports';
import Dialog from '@components/shared/Modals/Dialog';

interface DetailsProps {
  data: LeadRequestsReport;
  handleClose: () => void;
}

const Details = ({ data, handleClose }: DetailsProps) => {
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [isScoresOpen, setIsScoresOpen] = useState(false);

  const formattedData = getFormattedData(data);
  const rows = getFormattedRows(formattedData);

  const columns = useMemo(
    () =>
      getColumns({
        handleScores: () => setIsScoresOpen(true),
        handleRequestRespoonse: () => null
      }),
    []
  );

  const handleScoresClose = useCallback(() => setIsScoresOpen(false), []);

  const handleRowSelection = useCallback(
    (data: GridRowParams<RowData>) => setSelectedRow(data.row),
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
        onRowClick={handleRowSelection}
      />
      <Dialog
        displayConfirmBtn={false}
        title={selectedRow!.api}
        open={isScoresOpen}
        onClose={handleScoresClose}
        cancelText="Close"
      >
        <Scores data={selectedRow!.scores} />
      </Dialog>
    </Box>
  );
};

export default Details;
