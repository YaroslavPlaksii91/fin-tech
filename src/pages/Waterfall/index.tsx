import { useCallback, useEffect, useState } from 'react';
import { GridSortModel } from '@mui/x-data-grid-premium';
import { Button, Paper, Stack, Typography } from '@mui/material';

import { FetchList, RowData } from './types';
import { getFormattedRows } from './utils';
import getDataGridColumns from './columns';
import {
  AGGREGATION_ROW_STACK_NAME,
  DEFAULT_SORT,
  INITIAL_INPUT_FILTERS,
  INPUT_GROUPS_TO_SHOW
} from './constants';

import useFilters from '@hooks/useFilters';
import { StyledDataGridPremium } from '@components/shared/Table/styled';
import Filters from '@components/Filters/Filters';
import { theme } from '@theme';
import { reportingService } from '@services/reports';
import Logger from '@utils/logger';
import { TABLE } from '@constants/themeConstants';
import TuneIcon from '@icons/tune.svg';

const Waterfall = () => {
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [rows, setRows] = useState<RowData[]>([]);
  const [pinnedRows, setPinnedRows] = useState<RowData[]>([]);

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
    if (!model.length) return;
    const formatedSortField = model[0].sort === 'asc' ? '' : '-';
    const sortParams = `${formatedSortField}${model[0].field}`;

    setSort(sortParams);
  };

  const fetchList = async (params: FetchList) => {
    setLoading(true);

    try {
      const data = await reportingService.getWaterfallReport({ params });
      const rows = getFormattedRows(data.item2);
      const aggregationRow = rows.find(
        (row) => row.stack === AGGREGATION_ROW_STACK_NAME
      );
      const filteredRows = rows.filter((row) => aggregationRow?.id !== row.id);

      setRows(filteredRows);
      setPinnedRows(aggregationRow ? [aggregationRow] : []);
    } catch (e) {
      Logger.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetch = useCallback(() => {
    const params: FetchList = {
      sortBy: sort,
      pageSize: 10000, // temporary desion to retrive all records
      stack: inputFilters.stack || undefined,
      campaign: inputFilters.campaignId || undefined,
      startTime: dateFrom ? dateFrom.toISOString() : undefined,
      endTime: dateTo ? dateTo.toISOString() : undefined
    };

    void fetchList(params);
  }, [sort, inputFilters, dateFrom, dateTo]);

  useEffect(() => fetch(), [fetch]);

  return (
    <Stack sx={{ padding: '16px 32px', minWidth: '680px', width: '100%' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        py={2}
      >
        <Typography variant="h4">Waterfall</Typography>
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
          disableColumnMenu
          hideFooter
          autoHeight={rows.length * TABLE.ROW_HEIGHT < TABLE.HEIGHT}
          sx={{ height: TABLE.HEIGHT }}
          columnHeaderHeight={TABLE.COLUMN_HEIGHT}
          rowHeight={TABLE.ROW_HEIGHT}
          // We have border bottom 1px for each row, to include it in rowHeight calculation need also add spacing here
          getRowSpacing={() => ({ bottom: 1 })}
          rowSpacingType="border"
          pinnedRows={rows.length ? { bottom: pinnedRows } : undefined}
          rows={rows}
          columns={getDataGridColumns()}
          loading={loading}
          sortingMode="server"
          onSortModelChange={handleSortModelChange}
          getRowClassName={(params) => {
            if (!rows.length) return '';
            return params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd';
          }}
        />
      </Paper>
      <Filters
        isOpen={isFiltersOpen}
        hasTimePicker={false}
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

export default Waterfall;
