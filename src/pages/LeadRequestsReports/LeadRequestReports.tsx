import { useEffect, useState } from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridSortModel
} from '@mui/x-data-grid-premium';
import buildQuery from 'odata-query';
import { Container, Stack, Typography } from '@mui/material';
import React from 'react';

import { COLUMN_IDS } from './types';
import { getFormattedRows } from './utils';

import { reportingService } from '@services/lead-requests-reports';
import Logger from '@utils/logger';
import { RemoveRedEyeOutlinedIcon } from '@components/shared/Icons';
import DataGridPagination from '@components/shared/DataGridPagination';

const PAGE_SIZE = 25;
const DEFAULT_SORT = 'id asc';

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
  const [sort, setSort] = useState(DEFAULT_SORT);

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: PAGE_SIZE,
    page: 0
  });

  const fetchList = async (page: number, sort: string) => {
    try {
      setLoading(true);
      const params = buildQuery({
        top: PAGE_SIZE,
        skip: PAGE_SIZE * page,
        orderBy: sort,
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
    void fetchList(paginationModel.page, sort);
  }, [paginationModel.page, sort]);

  const handleSortModelChange = (model: GridSortModel) => {
    const sortParams = `${model[0].field} ${model[0].sort}`;
    setSort(sortParams);
  };

  return (
    // TODO: fix width value
    <Container
      maxWidth="xl"
      sx={{ overflow: 'auto', height: '100%', width: 'calc(100vw - 300px)' }}
    >
      <Stack sx={{ padding: '16px 32px' }}>
        <Typography pb={3} variant="h4">
          Lead requests
        </Typography>
        <DataGridPremium
          rows={rows}
          columns={dataGridColumns}
          loading={loading}
          rowCount={totalCount}
          disableColumnMenu={true}
          paginationMode="server"
          sortingMode="server"
          onSortModelChange={handleSortModelChange}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          slots={{
            footer: DataGridPagination
          }}
        />
      </Stack>
    </Container>
  );
}