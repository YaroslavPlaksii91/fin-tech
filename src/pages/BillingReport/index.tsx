import { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';

import { getFormattedRows } from './utils';
import getDataGridColumns from './columns';

import { StyledDataGridPremium } from '@components/shared/Table/styled';
import { theme } from '@theme';
import { reportingService } from '@services/reports';
import Logger from '@utils/logger';
import { TABLE } from '@constants/themeConstants';
import { BilingReport } from '@domain/billingReport';

const BillingReport = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BilingReport>({ item1: 1, item2: [] });

  const rows = useMemo(() => getFormattedRows(data.item2), [data.item2]);

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
        <Typography variant="h4">Biling Report</Typography>
      </Stack>
      <Paper
        elevation={1}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        <StyledDataGridPremium
          disableColumnMenu
          hideFooter
          disableColumnSorting
          autoHeight={rows.length * TABLE.ROW_HEIGHT < TABLE.HEIGHT}
          sx={{ height: TABLE.HEIGHT }}
          columnHeaderHeight={TABLE.COLUMN_HEIGHT}
          rowHeight={TABLE.ROW_HEIGHT}
          // We have border bottom 1px for each row, to include it in rowHeight calculation need also add spacing here
          getRowSpacing={() => ({ bottom: 1 })}
          rowSpacingType="border"
          rows={rows}
          columns={getDataGridColumns()}
          loading={loading}
          sortingMode="server"
          getRowClassName={(params) => {
            if (!rows.length) return '';
            return params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd';
          }}
        />
      </Paper>
    </Box>
  );
};

export default BillingReport;