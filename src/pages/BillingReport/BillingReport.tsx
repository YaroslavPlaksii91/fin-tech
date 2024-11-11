import { useEffect, useMemo, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';

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
import PageHeader from '@components/Layouts/PageHeader';

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
      <PageHeader title="Billing Report" />
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
          slots={{
            loadingOverlay: () => <LinearProgress />
          }}
        />
      </Paper>
    </Wrapper>
  );
};

export default BillingReports;
