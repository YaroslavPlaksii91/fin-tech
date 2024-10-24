import { useCallback, useEffect, useState } from 'react';
import { GridRowParams, GridSortModel } from '@mui/x-data-grid-premium';
import { Box, Stack, Typography } from '@mui/material';

import { COLUMN_IDS, FetchList, RowData, IFilters } from './types';
import { buildParams, getFormattedRows } from './utils';
import getDataGridColumns from './columns';
import {
  DEFAULT_EXPORT_FILE_NAME,
  DEFAULT_SORT,
  INITIAL_FILTERS
} from './constants';

import { reportingService } from '@services/reports';
import TablePagination from '@components/shared/Table/TablePagination';
import { StyledDataGridPremium } from '@components/shared/Table/styled';
import Details from '@components/LeadRequestsReports/Details';
import useTablePagination from '@hooks/useTablePagination';
import Logger from '@utils/logger';
import { TABLE } from '@constants/themeConstants';
import ExportCSVButton from '@components/shared/Buttons/ExportCSV';
import CustomNoResultsOverlay from '@components/shared/Table/CustomNoResultsOverlay';
import Filters from '@components/LeadRequestsReports/Filters';
import { Drawer } from '@components/shared/Drawer';
import FiltersButton from '@components/shared/Buttons/Filters';
import Paper from '@components/shared/Paper';

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

  const handleDetailsOpen = () => setIsDetailsOpen(true);

  const handleDetailsClose = () => setIsDetailsOpen(false);

  const columns = getDataGridColumns({ handleDetails: handleDetailsOpen });

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

  const handleSortModelChange = (model: GridSortModel) => {
    if (!model.length) return;
    const sortParams = `${model[0].field} ${model[0].sort}`;
    setSort(sortParams);
  };

  const handleRowSelection = (data: GridRowParams<RowData>) =>
    setSelectedRow(data.row);

  const handleExport = useCallback(async () => {
    const params = buildParams({ sort, filters });

    return reportingService.getLeadRequestsReportsExportCSV({ params });
  }, [filters, sort]);

  const fetchList = async (data: FetchList) => {
    setLoading(true);

    const params = buildParams(data);

    try {
      const data = await reportingService.getLeadRequestsReports({ params });
      const rows = getFormattedRows(data.items);

      setRows(rows);
      setTotalCount(data.totalItems);
    } catch (e) {
      Logger.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchList({
      // We have zero based pagination on FE
      page: page + 1,
      sort,
      rowsPerPage,
      filters
    });
  }, [page, rowsPerPage, sort, filters]);

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
            exportFile={handleExport}
          />
          <FiltersButton onClick={handleFiltersOpen} />
        </Stack>
      </Stack>
      <Paper>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <StyledDataGridPremium
            disableColumnMenu
            columnHeaderHeight={TABLE.COLUMN_HEIGHT}
            rowHeight={TABLE.ROW_HEIGHT}
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
        </Box>
      </Paper>
      <Filters
        isOpen={isFiltersOpen}
        filters={filters}
        onReset={handleFiltersReset}
        onSubmit={handleSubmit}
        onClose={handleFiltersClose}
      />
      <Drawer
        anchor="right"
        open={isDetailsOpen}
        onClose={handleDetailsClose}
        ModalProps={{
          BackdropProps: {
            style: { opacity: 0 }
          }
        }}
      >
        {selectedRow ? (
          <Details onClose={handleDetailsClose} data={selectedRow.data} />
        ) : null}
      </Drawer>
    </Box>
  );
};

export default LeadRequestsReports;
