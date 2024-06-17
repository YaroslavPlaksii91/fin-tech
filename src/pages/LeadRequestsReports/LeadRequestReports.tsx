import { useEffect, useState } from 'react';
import { GridColDef, GridSortModel } from '@mui/x-data-grid-premium';
import buildQuery from 'odata-query';
import { Button, Paper, Stack, Typography } from '@mui/material';

import { COLUMN_IDS } from './types';
import { getFormattedRows } from './utils';

import { reportingService } from '@services/lead-requests-reports';
import Logger from '@utils/logger';
import TablePagination from '@components/shared/TablePagination';
import { theme } from '@theme';
import { StyledDataGridPremium } from '@components/shared/Table/styled';
import useTablePagination from '@hooks/useTablePagination';

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
  {
    field: COLUMN_IDS.decision,
    headerName: 'Decision',
    renderCell: (row) => {
      switch (row.value) {
        case 'Approved':
          return (
            <Typography color={theme.palette.success.main} variant="body2">
              {row.value}
            </Typography>
          );
        case 'Denied':
          return (
            <Typography color={theme.palette.error.main} variant="body2">
              {row.value}
            </Typography>
          );
        default:
          return '-';
      }
    }
  },
  { field: COLUMN_IDS.denialReason, headerName: 'Denial Reason' },
  { field: COLUMN_IDS.state, headerName: 'State' },
  { field: COLUMN_IDS.apiVersion, headerName: 'API Version' },
  { field: COLUMN_IDS.totalTime, headerName: 'Total Time(sec)' },
  { field: COLUMN_IDS.cachedConnector, headerName: 'Cached Connector' },
  {
    field: COLUMN_IDS.details,
    headerName: '',
    pinnable: true,
    sortable: false,
    resizable: false,
    renderCell: () => (
      <Button size="small" variant="text">
        Details
      </Button>
    )
  }
];

type RowData = Record<Exclude<COLUMN_IDS, COLUMN_IDS.details>, string | number>;

export default function LeadRequestsReportsPage() {
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [totalCount, setTotalCount] = useState(0);

  const {
    rowsPerPage,
    page,
    totalPages,
    handlePageChange,
    handlePageByInputChange,
    handleRowsPerPageChange
  } = useTablePagination({ totalCount });

  const fetchList = async () => {
    try {
      setLoading(true);
      const params = buildQuery({
        top: rowsPerPage,
        skip: rowsPerPage * page,
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
    void fetchList();
  }, [rowsPerPage, page, sort]);

  const handleSortModelChange = (model: GridSortModel) => {
    const sortParams = `${model[0].field} ${model[0].sort}`;
    setSort(sortParams);
  };

  return (
    <Stack sx={{ padding: '16px 32px' }}>
      <Typography pb={3} variant="h4">
        Lead requests
      </Typography>
      <Paper
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '16px',
          overflow: 'hidden',
          minWidth: '680px'
        }}
      >
        <StyledDataGridPremium
          autoHeight
          disableColumnReorder
          disableColumnMenu
          isRowSelectable={() => false}
          columnHeaderHeight={32}
          rowHeight={28}
          rows={rows}
          rowCount={rowsPerPage}
          columns={dataGridColumns}
          loading={loading}
          sortingMode="server"
          paginationMode="client"
          pinnedColumns={{ right: [COLUMN_IDS.details] }}
          onSortModelChange={handleSortModelChange}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          slots={{
            footer: () => (
              <TablePagination
                count={totalCount}
                totalPages={totalPages}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onPageByInputChange={handlePageByInputChange}
              />
            )
          }}
        />
      </Paper>
    </Stack>
  );
}
