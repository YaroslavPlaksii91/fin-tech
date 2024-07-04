import { useEffect, useState } from 'react';
import buildQuery from 'odata-query';
import { GridSortModel } from '@mui/x-data-grid-premium';
import { Button, Paper, Stack, Typography } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';

import { FetchList, RowData } from './types';
import { getFormattedRows } from './utils';
import getDataGridColumns from './columns';
import {
  DEFAULT_SORT,
  INITIAL_INPUT_FILTERS,
  INPUT_GROUPS_TO_SHOW
} from './constants';

import useTablePagination from '@hooks/useTablePagination';
import useFilters from '@hooks/useFilters';
import { StyledDataGridPremium } from '@components/shared/Table/styled';
import TablePagination from '@components/shared/TablePagination';
import Filters from '@components/Filters/Filters';
import { theme } from '@theme';
import { reportingService } from '@services/lead-requests-reports';
import Logger from '@utils/logger';

const DenielReasons = () => {
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [rows, setRows] = useState<RowData[]>([]);

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
    inputFilters,
    dateFilters: { dateFrom, dateTo }
  } = useFilters({ initialInputFilters: INITIAL_INPUT_FILTERS });

  const handleSortModelChange = (model: GridSortModel) => {
    const sortParams = `${model[0].field} ${model[0].sort}`;
    setSort(sortParams);
  };

  const fetchList = async ({
    page,
    sort,
    filter: { startDate, endDate, deniedBy, rejectionReason } = {}
  }: FetchList) => {
    setLoading(true);

    const queries = {
      top: rowsPerPage,
      skip: rowsPerPage * page,
      orderBy: sort,
      count: true,
      filter: {
        deniedBy,
        rejectionReason,
        date: {
          ge: startDate,
          le: endDate
        }
      }
    };

    // We need to replace default odata $filter with entityFilter,
    // Because this is expected on backend for this Report
    const params = buildQuery(queries).replace('$filter', 'entityFilter');

    const removeSingleQuotes = (odataParams: string) =>
      odataParams.replace(
        /'(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)'/g,
        '$1'
      );

    const correctedParams = removeSingleQuotes(params);

    try {
      const data =
        await reportingService.getDenialReasonsReport(correctedParams);
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
      filter: {
        startDate: dateFrom ? dateFrom.toISOString() : undefined,
        endDate: dateTo ? dateTo.toISOString() : undefined,
        rejectionReason: inputFilters.denialReasons || undefined,
        deniedBy: inputFilters.deniedBy || undefined
      }
    };

    void fetchList(params);
  };

  useEffect(
    () => fetch(),
    [page, rowsPerPage, sort, dateFrom, dateTo, inputFilters]
  );

  return (
    <Stack sx={{ padding: '16px 32px', minWidth: '680px', width: '100%' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        py={2}
      >
        <Typography variant="h4">Denial Reasons</Typography>
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
          overflow: 'hidden'
        }}
      >
        <StyledDataGridPremium
          autoHeight
          disableColumnMenu
          columnHeaderHeight={32}
          rowHeight={28}
          rows={rows}
          columns={getDataGridColumns()}
          loading={loading}
          sortingMode="server"
          paginationMode="client"
          onSortModelChange={handleSortModelChange}
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
        inputFilters={inputFilters}
        inputGroupsToshow={INPUT_GROUPS_TO_SHOW}
        handleReset={handleFiltersReset}
        handleApply={handleFiltersApply}
        handleClose={handleFiltersClose}
      />
    </Stack>
  );
};

export default DenielReasons;
