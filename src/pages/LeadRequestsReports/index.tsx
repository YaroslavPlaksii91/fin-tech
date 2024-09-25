import { useCallback, useEffect, useMemo, useState } from 'react';
import { GridRowParams, GridSortModel } from '@mui/x-data-grid-premium';
import buildQuery from 'odata-query';
import { Box, Button, Drawer, Paper, Stack, Typography } from '@mui/material';

import {
  COLUMN_IDS,
  FetchList,
  FiltersParams,
  OdataQueries,
  RowData,
  IDateFilters
} from './types';
import { getFormattedRows } from './utils';
import getDataGridColumns from './columns';
import {
  DEFAULT_EXPORT_FILE_NAME,
  DEFAULT_SORT,
  INITIAL_DATE_FILTERS
} from './constants';

import { reportingService } from '@services/reports';
import TablePagination from '@components/shared/TablePagination';
import { theme } from '@theme';
import { StyledDataGridPremium } from '@components/shared/Table/styled';
import Details from '@components/LeadRequestsReports/Details';
import useTablePagination from '@hooks/useTablePagination';
import Logger from '@utils/logger';
import { TABLE } from '@constants/themeConstants';
import TuneIcon from '@icons/tune.svg';
import ExportCSVButton from '@components/shared/ExportCSVButton';
import { removeSingleQuotesODataParams } from '@utils/helpers';
import { getDateInUTC } from '@utils/date';
import CustomNoResultsOverlay from '@components/shared/Table/CustomNoResultsOverlay';
import Filters, { IFormState } from '@components/LeadRequestsReports/Filters';

const LeadRequestsReports = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [totalCount, setTotalCount] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [dateFilters, setDateFilters] =
    useState<IDateFilters>(INITIAL_DATE_FILTERS);

  const [requestId, setRequestId] = useState('');
  const [loanId, setLoanId] = useState('');

  const {
    rowsPerPage,
    page,
    totalPages,
    handlePageChange,
    handlePageApply,
    handleRowsPerPageChange
  } = useTablePagination({ totalCount });

  const handleFiltersOpen = () => setIsFiltersOpen(true);

  const handleFiltersClose = () => setIsFiltersOpen(false);

  const handleFiltersReset = () => {
    setDateFilters(INITIAL_DATE_FILTERS);
    setRequestId('');
    setLoanId('');
    handleFiltersClose();
  };

  const handleSubmit = (data: IFormState) => {
    setDateFilters(data.dateFilters);
    setRequestId(data.requestId);
    setLoanId(data.loanId);
    handleFiltersClose();
  };

  const handleDetailsOpen = () => setIsDetailsOpen(true);

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
    filters: { startDate, endDate, requestId, loanId },
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
          executionEndDateTimeUtc: {
            ge: startDate ? getDateInUTC(startDate).toISOString() : undefined,
            le: endDate ? getDateInUTC(endDate).toISOString() : undefined
          }
        },
        // ...(requestId && { requestId: { eq: requestId } }),
        and: [
          requestId && { 'leadRequest/requestId': { contains: requestId } },
          loanId && { 'leadResponse/loanId': { contains: loanId } }
        ]
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
        startDate: dateFilters.from,
        endDate: dateFilters.to,
        requestId,
        loanId
      }
    };

    void fetchList(params);
  };

  useEffect(
    () => fetch(),
    [page, rowsPerPage, sort, dateFilters, requestId, loanId]
  );

  const handleExportLeadRequestReports = useCallback(async () => {
    const filters = {
      startDate: dateFilters.from,
      endDate: dateFilters.to
    };

    const correctedParams = buildOdataParams({
      page,
      sort,
      filters,
      includePagination: false
    });

    return reportingService.getLeadRequestsReportsExportCSV(correctedParams);
  }, [dateFilters, sort, page]);

  return (
    <Box sx={{ padding: '16px 24px' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        pb={2}
      >
        <Typography variant="h4">Applications</Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <ExportCSVButton
            defaultFileName={DEFAULT_EXPORT_FILE_NAME}
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
            noRowsOverlay: CustomNoResultsOverlay,
            footer: () => (
              <TablePagination
                isDisabled={loading}
                count={totalCount}
                totalPages={totalPages}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onPageApply={handlePageApply}
              />
            )
          }}
        />
      </Paper>
      <Filters
        isOpen={isFiltersOpen}
        requestId={requestId}
        loanId={loanId}
        dateFilters={dateFilters}
        onReset={handleFiltersReset}
        onSubmit={handleSubmit}
        onClose={handleFiltersClose}
      />
      <Drawer anchor="right" open={isDetailsOpen} onClose={handleDetailsClose}>
        {selectedRow ? (
          <Details handleClose={handleDetailsClose} data={selectedRow.data} />
        ) : null}
      </Drawer>
    </Box>
  );
};

export default LeadRequestsReports;
