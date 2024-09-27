import { useCallback, useEffect, useMemo, useState } from 'react';
import { GridRowParams, GridSortModel } from '@mui/x-data-grid-premium';
import { Box, Button, Drawer, Paper, Stack, Typography } from '@mui/material';

import { COLUMN_IDS, FetchList, RowData, IFilters } from './types';
import { buildOdataParams, getFormattedRows } from './utils';
import getDataGridColumns from './columns';
import {
  DEFAULT_EXPORT_FILE_NAME,
  DEFAULT_SORT,
  INITIAL_FILTERS
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
import CustomNoResultsOverlay from '@components/shared/Table/CustomNoResultsOverlay';
import Filters from '@components/LeadRequestsReports/Filters';

const LeadRequestsReports = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [totalCount, setTotalCount] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<IFilters>(INITIAL_FILTERS);

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
    setFilters(INITIAL_FILTERS);
    handleFiltersClose();
  };

  const handleSubmit = (data: IFilters) => {
    setFilters(data);
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

  const fetchList = async (data: FetchList) => {
    setLoading(true);

    const params = buildOdataParams(data);

    try {
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
    void fetchList({
      page,
      sort,
      rowsPerPage,
      filters
    });
  }, [page, rowsPerPage, sort, filters]);

  const handleExportLeadRequestReports = useCallback(async () => {
    const params = buildOdataParams({
      page,
      sort,
      rowsPerPage,
      filters,
      includePagination: false
    });

    return reportingService.getLeadRequestsReportsExportCSV(params);
  }, [filters, rowsPerPage, sort, page]);

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
        filters={filters}
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
