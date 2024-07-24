import { useCallback, useEffect, useMemo, useState } from 'react';
import { GridRowParams, GridSortModel } from '@mui/x-data-grid-premium';
import buildQuery from 'odata-query';
import { Box, Button, Drawer, Paper, Stack, Typography } from '@mui/material';

import {
  COLUMN_IDS,
  FetchList,
  FiltersParams,
  OdataQueries,
  RowData
} from './types';
import { getFormattedRows } from './utils';
import getDataGridColumns from './columns';
import { DEFAULT_SORT } from './constants';

import { reportingService } from '@services/reports';
import TablePagination from '@components/shared/TablePagination';
import Filters from '@components/Filters/Filters';
import { theme } from '@theme';
import { StyledDataGridPremium } from '@components/shared/Table/styled';
import Details from '@components/LeadRequestsReports/Details';
import useTablePagination from '@hooks/useTablePagination';
import Logger from '@utils/logger';
import useFilters from '@hooks/useFilters';
import { TABLE } from '@constants/themeConstants';
import TuneIcon from '@icons/tune.svg';
import ExportCSVButton from '@components/shared/ExportCSVButton';
import { removeSingleQuotesODataParams } from '@utils/helpers';

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
    if (!model.length) return;
    const sortParams = `${model[0].field} ${model[0].sort}`;
    setSort(sortParams);
  };

  const handleRowSelection = (data: GridRowParams<RowData>) =>
    setSelectedRow(data.row);

  const buildOdataParams = ({
    page,
    sort,
    filters: { startDate, endDate },
    includePagination = true
  }: {
    page: number;
    sort: string;
    filters: FiltersParams;
    includePagination?: boolean;
  }): string => {
    const queries: OdataQueries = {
      orderBy: sort,
      filter: {
        processingMetadata: {
          processingDateTimeUtc: {
            ge: startDate ? startDate.toISOString() : undefined,
            le: endDate ? endDate.toISOString() : undefined
          }
        }
      }
    };

    if (includePagination) {
      queries.top = rowsPerPage;
      queries.skip = rowsPerPage * page;
      queries.count = true;
    }

    const params = buildQuery(queries);
    return removeSingleQuotesODataParams(params);
  };

  const fetchList = async ({ page, sort, filters }: FetchList) => {
    setLoading(true);

    const correctedParams = buildOdataParams({ page, sort, filters });
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
    const params: FetchList = {
      page,
      sort,
      filters: {
        startDate: dateFrom,
        endDate: dateTo
      }
    };

    void fetchList(params);
  };

  useEffect(() => fetch(), [page, rowsPerPage, sort, dateFrom, dateTo]);

  const handleExportLeadRequestReports = useCallback(async () => {
    const filters = {
      startDate: dateFrom,
      endDate: dateTo
    };

    const correctedParams = buildOdataParams({
      page,
      sort,
      filters,
      includePagination: false
    });

    return reportingService.getLeadRequestsReportsExportCSV(correctedParams);
  }, [dateFrom, dateTo, sort, page]);

  return (
    <Box sx={{ padding: '16px 24px' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
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
          <ExportCSVButton
            fileName="lead-request-reports"
            exportFile={handleExportLeadRequestReports}
          />
          <Button
            size="small"
            color="inherit"
            variant="outlined"
            sx={{ minWidth: '80px', borderRadius: '6px' }}
            startIcon={<TuneIcon />}
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
          overflow: 'hidden'
        }}
      >
        <StyledDataGridPremium
          autoHeight
          disableColumnMenu
          columnHeaderHeight={TABLE.COLUMN_HEIGHT}
          rowHeight={TABLE.ROW_HEIGHT}
          // We have border bottom 1px for each row, to include it in rowHeight calculation need also add spacing here
          getRowSpacing={() => ({ bottom: 1 })}
          rowSpacingType="border"
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
                isDisabled={loading}
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
    </Box>
  );
}
