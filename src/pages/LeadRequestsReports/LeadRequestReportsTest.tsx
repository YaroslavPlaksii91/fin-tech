import { useEffect, useState } from 'react';
import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';
import buildQuery from 'odata-query';
import { Stack, Typography } from '@mui/material';
import React from 'react';

import { COLUMN_IDS } from './types';
import { DataGridContainer } from './styled';
import { getFormattedRows } from './utils';

import { reportingService } from '@services/lead-requests-reports';
import { LayoutContainer } from '@components/Layouts/MainLayout';
import Logger from '@utils/logger';
import { RemoveRedEyeOutlinedIcon } from '@components/shared/Icons';
import DataGridPagination from '@components/shared/DataGridPagination';

const PAGE_SIZE = 10;
const DEFAULT_SORT = 'correlationId desc';

const dataGridColumns: GridColDef[] = [
  { field: COLUMN_IDS.requestId, headerName: 'Request ID' },
  { field: COLUMN_IDS.loanId, headerName: 'Loan ID' },
  { field: COLUMN_IDS.leadProvider, headerName: 'Lead Provider' },
  { field: COLUMN_IDS.leadCampaign, headerName: 'Lead Campaign' },
  { field: COLUMN_IDS.customerId, headerName: 'Customer ID' },
  { field: COLUMN_IDS.leadPrice, headerName: 'Lead Price' },
  { field: COLUMN_IDS.affiliate, headerName: 'Affiliate' },
  { field: COLUMN_IDS.requestDate, headerName: 'Request date' },
  { field: COLUMN_IDS.requestedAmount, headerName: 'Request amount' },
  { field: COLUMN_IDS.stackName, headerName: 'Stack Name' },
  { field: COLUMN_IDS.promoCode, headerName: 'Promo Code' },
  { field: COLUMN_IDS.store, headerName: 'Store' },
  { field: COLUMN_IDS.ssn, headerName: 'SSN' },
  { field: COLUMN_IDS.email, headerName: 'Email' },
  { field: COLUMN_IDS.decision, headerName: 'Decision' },
  { field: COLUMN_IDS.denialReason, headerName: 'Denial Reason' },
  { field: COLUMN_IDS.state, headerName: 'State' },
  { field: COLUMN_IDS.apiVersion, headerName: 'API Version' },
  { field: COLUMN_IDS.totalTime, headerName: 'Total Time(sec)' },
  { field: COLUMN_IDS.cachedConnector, headerName: 'Cached Connector' },
  {
    field: COLUMN_IDS.details,
    headerName: '',
    width: 45,
    renderCell: () => <RemoveRedEyeOutlinedIcon />
  }
];

type RowData = Record<Exclude<COLUMN_IDS, COLUMN_IDS.details>, string | number>;

export default function LeadRequestsReportsPage() {
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  // TODO: unblock when BE fix sorting
  // const [sort, setSort] = useState(DEFAULT_SORT);

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: PAGE_SIZE,
    page: 0
  });

  const fetchList = async (page: number) => {
    try {
      setLoading(true);
      const params = buildQuery({
        top: PAGE_SIZE,
        skip: PAGE_SIZE * page,
        orderBy: DEFAULT_SORT,
        count: true
      });
      const data = await reportingService.getLeadRequestsReports(params);
      const rows = getFormattedRows(data.value);
      setRows(rows);
      setTotalCount(data['@odata.count']);
    } catch (e) {
      Logger.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchList(paginationModel.page);
  }, [paginationModel.page]);

  // TODO: unblock when BE fix sorting
  // const handleSortModelChange = (model: GridSortModel) => {
  //   const sortParams = `${model[0].field} ${model[0].sort}`;
  //   setSort(sortParams);
  // };

  return (
    <LayoutContainer>
      <Stack sx={{ width: '100%', overflow: 'hidden', padding: '16px 32px' }}>
        <Typography pb={3} variant="h1">
          Lead requests
        </Typography>
        <DataGridContainer>
          <DataGridPremium
            rows={rows}
            columns={dataGridColumns}
            loading={loading}
            rowCount={totalCount}
            disableColumnMenu={true}
            paginationMode="server"
            // TODO: enable column sorting when BE fix sorting
            disableColumnSorting={true}
            // sortingMode="server"
            // onSortModelChange={handleSortModelChange}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            slots={{
              footer: DataGridPagination
            }}
          />
        </DataGridContainer>
      </Stack>
    </LayoutContainer>
  );
}
