import { useEffect, useState } from 'react';
import {
  DataGridPremium,
  GridColDef,
  gridPageCountSelector,
  gridPageSelector,
  GridSortModel,
  useGridApiContext,
  useGridSelector
} from '@mui/x-data-grid-premium';
import buildQuery from 'odata-query';
import { MenuItem, Pagination, Select, Stack, Typography } from '@mui/material';
import React from 'react';

import { COLUMN_IDS } from './types';
import { DataGridContainer } from './styled';

import { reportingService } from '@services/lead-requests-reports';
import { LayoutContainer } from '@components/Layouts/MainLayout';
import Logger from '@utils/logger';
import { RemoveRedEyeOutlinedIcon } from '@components/shared/Icons';

const pageSize = 10;

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
  const [sort, setSort] = useState('leadRequest/requestId desc');

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0
  });

  const fetchList = async (page: number, sort: string) => {
    try {
      setLoading(true);
      const params = buildQuery({
        top: pageSize,
        skip: pageSize * page,
        orderBy: sort,
        count: true
      });
      const data = await reportingService.getLeadRequestsReports(params);
      const rows = data.value.map((item) => ({
        id: item.id,
        [COLUMN_IDS.requestId]: item.leadRequest.requestId,
        [COLUMN_IDS.loanId]: item.leadResponse.loanId ?? '-',
        [COLUMN_IDS.leadProvider]: item.leadRequest.leadProviderId,
        [COLUMN_IDS.leadCampaign]: item.leadRequest.campaignId,
        [COLUMN_IDS.customerId]: item.leadResponse.customerId ?? '-',
        [COLUMN_IDS.leadPrice]: item.leadResponse.leadPrice ?? '-',
        [COLUMN_IDS.affiliate]: item.leadRequest.affiliateId,
        [COLUMN_IDS.requestDate]:
          item.processingMetadata?.processingDateTimeUtc ?? '-',
        [COLUMN_IDS.requestedAmount]: item.leadRequest.requestedAmount ?? '-',
        [COLUMN_IDS.stackName]: item.output?.stack ?? '-',
        [COLUMN_IDS.promoCode]: item.leadRequest.customFields?.promoCode ?? '-',
        [COLUMN_IDS.store]: item.output?.store ?? '-',
        [COLUMN_IDS.ssn]: item.leadRequest.ssn,
        [COLUMN_IDS.email]: item.leadRequest.email,
        [COLUMN_IDS.decision]: item.output?.decision ?? '-',
        [COLUMN_IDS.denialReason]: item.output?.denialReason ?? '-',
        [COLUMN_IDS.state]: item.leadRequest.state,
        [COLUMN_IDS.apiVersion]: item.processingMetadata?.apiVersion ?? '-',
        [COLUMN_IDS.totalTime]: item.processingMetadata?.processingTime ?? '-',
        [COLUMN_IDS.cachedConnector]:
          item.processingMetadata?.cachedConnector ?? '-'
      }));
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
            sortingMode="server"
            onSortModelChange={handleSortModelChange}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            slots={{
              footer: Footer
            }}
          />
        </DataGridContainer>
      </Stack>
    </LayoutContainer>
  );
}

function Footer() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{ padding: '12px 24px' }}
    >
      <Stack direction="row" alignItems="center">
        <Typography variant="h6" pr={1}>
          {' '}
          Go to
        </Typography>
        <Select
          value={page + 1}
          onChange={(event) => {
            apiRef.current.setPage(+event.target.value - 1);
          }}
          size="small"
          displayEmpty
          inputProps={{ 'aria-label': ' Go to page' }}
        >
          {Array.from({ length: pageCount }, (_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {i + 1}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Pagination
        sx={(theme) => ({ padding: theme.spacing(1.5, 0) })}
        color="primary"
        count={pageCount}
        page={page + 1}
        onChange={(_event, value) => apiRef.current.setPage(value - 1)}
      />
    </Stack>
  );
}
