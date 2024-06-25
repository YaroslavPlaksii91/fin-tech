import { useCallback, useEffect, useMemo, useState } from 'react';
import { GridRowParams, GridSortModel } from '@mui/x-data-grid-premium';
import buildQuery from 'odata-query';
import { Button, Drawer, Paper, Stack, Typography } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';

import { COLUMN_IDS, FetchList, OdataQueries, RowData } from './types';
import { getFormattedRows } from './utils';
import { DEFAULT_SORT } from './constants';
import getDataGridColumns from './columns';

import { reportingService } from '@services/lead-requests-reports';
import TablePagination from '@components/shared/TablePagination';
import Filters from '@components/Filters/Filters';
import { theme } from '@theme';
import { StyledDataGridPremium } from '@components/shared/Table/styled';
import Details from '@components/LeadRequestsReports/Details';
import useTablePagination from '@hooks/useTablePagination';
import Logger from '@utils/logger';
import useFilters from '@hooks/useFilters';

export default function LeadRequestsReportsPage() {
  const [rows, setRows] = useState<RowData[]>([]);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
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

  const {
    isFiltersOpen,
    handleFiltersOpen,
    handleFiltersClose,
    handleFiltersReset,
    handleFiltersApply,
    dateFilters: { dateFrom, dateTo }
  } = useFilters();

  const handleDetailsOpen = useCallback(() => setIsDetailsOpen(true), []);

  const handleDetailsClose = () => setIsDetailsOpen(false);

  const columns = useMemo(
    () => getDataGridColumns({ handleDetails: handleDetailsOpen }),
    [handleDetailsOpen]
  );

  const handleSortModelChange = (model: GridSortModel) => {
    const sortParams = `${model[0].field} ${model[0].sort}`;
    setSort(sortParams);
  };

  const handleRowSelection = (data: GridRowParams<RowData>) =>
    setSelectedRow(data.row);

  const fetchList = async ({ page, sort, startDate, endDate }: FetchList) => {
    setLoading(true);

    const queries: OdataQueries = {
      top: rowsPerPage,
      skip: rowsPerPage * page,
      orderBy: sort,
      count: true
    };

    if (startDate && endDate) {
      queries.filter = {
        processingMetadata: {
          processingDateTimeUtc: {
            ge: startDate,
            le: endDate
          }
        }
      };
    }

    const params = buildQuery(queries);

    const removeSingleQuotes = () =>
      params.replace(/'(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)'/g, '$1');

    const correctedParams = removeSingleQuotes();

    try {
      const data =
        await reportingService.getLeadRequestsReports(correctedParams);
      const rows = getFormattedRows(data.value);

      setRows(rows);
      setTotalCount(data['@odata.count']);
    } catch (e) {
      Logger.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetch = () => {
    const params: FetchList = { page, sort };

    if (dateFrom && dateTo) {
      params.startDate = dateFrom.toISOString();
      params.endDate = dateTo.toISOString();
    }

    void fetchList(params);
  };

  useEffect(() => fetch(), [page, rowsPerPage, sort, dateFrom, dateTo]);

  return (
    <Stack sx={{ padding: '16px 32px' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        overflow="auto"
        spacing={2}
        py={2}
      >
        <Typography variant="h4">Applications</Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Button
            size="small"
            color="inherit"
            variant="outlined"
            sx={{ minWidth: '80px', borderRadius: '6px' }}
            startIcon={<TuneIcon sx={{ transform: 'rotate(180deg)' }} />}
            onClick={handleFiltersOpen}
          >
            Filters
          </Button>
        </Stack>
      </Stack>
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
          disableColumnMenu
          columnHeaderHeight={32}
          rowHeight={28}
          rows={rows}
          columns={columns}
          loading={loading}
          sortingMode="server"
          paginationMode="client"
          pinnedColumns={{ right: [COLUMN_IDS.details] }}
          onSortModelChange={handleSortModelChange}
          onRowClick={handleRowSelection}
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
      <Filters
        isOpen={isFiltersOpen}
        dateFilters={{ dateFrom, dateTo }}
        handleReset={handleFiltersReset}
        handleApply={handleFiltersApply}
        handleClose={handleFiltersClose}
      />
      <Drawer anchor="right" open={isDetailsOpen} onClose={handleDetailsClose}>
        {selectedRow ? (
          <Details handleClose={handleDetailsClose} data={selectedRow.data} />
        ) : null}
      </Drawer>
    </Stack>
  );
}
