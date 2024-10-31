import { useEffect, useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';

import { getFormattedRows } from './utils';
import getDataGridColumns from './columns';
import { INITIAL_DATA, TOTAL_ROW_NAME } from './constants';

import { reportingService } from '@services/reports';
import Logger from '@utils/logger';
import { BillingReport } from '@domain/billingReport';
import Paper from '@components/shared/Paper';
import DataGrid from '@components/shared/Table/DataGrid';
import { TABLE_WRAPPER_HEIGHT } from '@constants/themeConstants';
import { Wrapper } from '@components/Layouts/styled';

const BillingReports = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BillingReport>(INITIAL_DATA);

  const rows = useMemo(() => getFormattedRows(data.item2), [data.item2]);

  const pinnedRows = useMemo(
    () => ({ bottom: rows.filter((row) => row.month === TOTAL_ROW_NAME) }),
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
    <Wrapper>
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
        <DataGrid
          hideFooter
          disableColumnSorting
          pinnedRows={pinnedRows}
          rows={rows}
          columns={getDataGridColumns()}
          loading={loading}
          sortingMode="server"
          wrapperSx={{ maxHeight: TABLE_WRAPPER_HEIGHT }}
        />
      </Paper>
    </Wrapper>
  );
};

export default BillingReports;
