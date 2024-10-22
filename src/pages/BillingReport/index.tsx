import { useEffect, useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';

import { getFormattedRows } from './utils';
import getDataGridColumns from './columns';
import { TOTAL_ROW_NAME } from './constants';

import { StyledDataGridPremium } from '@components/shared/Table/styled';
import { reportingService } from '@services/reports';
import Logger from '@utils/logger';
import { TABLE } from '@constants/themeConstants';
import { BillingReport } from '@domain/billingReport';
import CustomNoResultsOverlay from '@components/shared/Table/CustomNoResultsOverlay';
import Paper from '@components/shared/Paper';

const BillingReports = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BillingReport>({ item1: 1, item2: [] });

  const rows = useMemo(() => getFormattedRows(data.item2), [data.item2]);

  const totalRow = useMemo(
    () => rows.filter((row) => row.month === TOTAL_ROW_NAME),
    [rows]
  );

  const fetchList = async () => {
    setLoading(true);

    try {
      const data = await reportingService.getBillingReport({
        params: { pageNumber: 1, pageSize: 10000 }
      });

      setData(data);
    } catch (e) {
      Logger.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => void fetchList(), []);

  return (
    <Box sx={{ padding: '16px 24px' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        pb={2}
      >
        <Typography variant="h4">Billing Report</Typography>
      </Stack>
      <Paper>
        <StyledDataGridPremium
          disableColumnMenu
          hideFooter
          disableColumnSorting
          autoHeight={rows.length * TABLE.ROW_HEIGHT < TABLE.HEIGHT}
          sx={{ height: TABLE.HEIGHT }}
          columnHeaderHeight={TABLE.COLUMN_HEIGHT}
          rowHeight={TABLE.ROW_HEIGHT}
          pinnedRows={{ bottom: totalRow }}
          rows={rows}
          columns={getDataGridColumns()}
          loading={loading}
          sortingMode="server"
          getRowClassName={(params) => {
            if (!rows.length) return '';
            return params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd';
          }}
          slots={{ noRowsOverlay: CustomNoResultsOverlay }}
        />
      </Paper>
    </Box>
  );
};

export default BillingReports;
