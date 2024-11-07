import { useCallback, useEffect, useMemo, useState } from 'react';
import { GridRowParams, GridSortModel } from '@mui/x-data-grid-premium';
import { Stack, Typography } from '@mui/material';

import { COLUMN_IDS, FetchList, RowData } from './types';
import { buildParams, getFormattedRows } from './utils';
import getDataGridColumns from './columns';
import {
  DEFAULT_EXPORT_FILE_NAME,
  DEFAULT_SORT,
  INITIAL_FILTERS,
  PINNED_COLUMNS
} from './constants';

import { reportingService } from '@services/reports';
import TablePagination from '@components/shared/Table/TablePagination';
import Details from '@components/LeadRequestsReports/Details';
import useTablePagination from '@hooks/useTablePagination';
import useFilters from '@hooks/useFilters';
import Logger from '@utils/logger';
import ExportCSVButton from '@components/shared/Buttons/ExportCSV';
import Filters from '@components/LeadRequestsReports/Filters';
import { Drawer } from '@components/shared/Drawer';
import FiltersButton from '@components/shared/Buttons/Filters';
import Paper from '@components/shared/Paper';
import DataGrid from '@components/shared/Table/DataGrid';
import { TABLE_WRAPPER_HEIGHT } from '@constants/themeConstants';
import { Wrapper } from '@components/Layouts/styled';

const LeadRequestsReports = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [totalCount, setTotalCount] = useState(0);

  const {
    isFiltersOpen,
    filters,
    handleFiltersOpen,
    handleFiltersClose,
    handleFiltersSubmit,
    handleFiltersReset
  } = useFilters(INITIAL_FILTERS);

  const {
    rowsPerPage,
    page,
    totalPages,
    setPage,
    handlePageChange,
    handleRowsPerPageChange
  } = useTablePagination({ totalCount });

  const handleDetailsOpen = useCallback(() => setIsDetailsOpen(true), []);

  const handleDetailsClose = () => setIsDetailsOpen(false);

  const dataGridSlots = useMemo(
    () => ({
      footer: () => (
        <TablePagination
          isDisabled={loading}
          count={totalCount}
          totalPages={totalPages}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onPageApply={setPage}
        />
      )
    }),
    [
      loading,
      totalCount,
      totalPages,
      page,
      rowsPerPage,
      handlePageChange,
      handleRowsPerPageChange
    ]
  );

  const columns = useMemo(
    () => getDataGridColumns({ handleDetails: handleDetailsOpen }),
    [handleDetailsOpen]
  );

  const handleSortModelChange = useCallback((model: GridSortModel) => {
    let sortParams = `${model[0].field} ${model[0].sort}`;

    if (model[0].field === 'fullName')
      sortParams = `${COLUMN_IDS.firstName} ${model[0].sort}, ${COLUMN_IDS.lastName} ${model[0].sort}`;

    setSort(sortParams);
  }, []);

  const handleRowSelection = useCallback(
    (data: GridRowParams<RowData>) => setSelectedRow(data.row),
    []
  );

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
    <Wrapper>
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
        <DataGrid
          rows={rows}
          rowCount={loading ? 0 : rows.length}
          columns={columns}
          loading={loading}
          sortingMode="server"
          paginationMode="server"
          rowsLoadingMode="server"
          pinnedColumns={PINNED_COLUMNS}
          onSortModelChange={handleSortModelChange}
          onRowClick={handleRowSelection}
          slots={dataGridSlots}
          wrapperSx={{ maxHeight: TABLE_WRAPPER_HEIGHT }}
        />
      </Paper>
      <Filters
        isOpen={isFiltersOpen}
        filters={filters}
        onReset={handleFiltersReset}
        onSubmit={handleFiltersSubmit}
        onClose={handleFiltersClose}
      />
      <Drawer
        anchor="right"
        open={isDetailsOpen}
        onClose={handleDetailsClose}
        ModalProps={{ BackdropProps: { style: { opacity: 0 } } }}
      >
        {selectedRow ? (
          <Details onClose={handleDetailsClose} data={selectedRow.data} />
        ) : null}
      </Drawer>
    </Wrapper>
  );
};

export default LeadRequestsReports;
