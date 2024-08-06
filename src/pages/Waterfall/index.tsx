import { useCallback, useEffect, useMemo, useState } from 'react';
import { GridSortModel } from '@mui/x-data-grid-premium';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Dayjs } from 'dayjs';

import { FetchList } from './types';
import { getFormattedRows } from './utils';
import getDataGridColumns from './columns';
import {
  AGGREGATION_ROW_STACK_NAME,
  DEFAULT_EXPORT_FILE_NAME,
  DEFAULT_SORT,
  INITIAL_INPUT_FILTERS,
  INPUT_GROUPS_TO_SHOW
} from './constants';
import { StyledDataGridPremium } from './styled';

import useFilters from '@hooks/useFilters';
import Filters from '@components/Filters/Filters';
import { theme } from '@theme';
import { reportingService } from '@services/reports';
import Logger from '@utils/logger';
import { TABLE } from '@constants/themeConstants';
import TuneIcon from '@icons/tune.svg';
import { WaterfallReport } from '@domain/waterfallReport';
import ExportCSVButton from '@components/shared/ExportCSVButton';
import { InputFiltersType } from '@components/Filters/types';
import { getDateInUTC } from '@utils/date';

const Waterfall = () => {
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [data, setData] = useState<WaterfallReport>({ item1: 0, item2: [] });

  const {
    isFiltersOpen,
    handleFiltersOpen,
    handleFiltersClose,
    handleFiltersReset,
    handleFiltersApply,
    inputFilters,
    dateFilters: { dateFrom, dateTo }
  } = useFilters({ initialInputFilters: INITIAL_INPUT_FILTERS });

  const columns = useMemo(() => getDataGridColumns(data.item2), [data.item2]);

  const rows = useMemo(() => getFormattedRows(data.item2), [data.item2]);

  const aggregationTotalRow = useMemo(
    () => rows.filter((row) => row.stack === AGGREGATION_ROW_STACK_NAME),
    [rows]
  );

  const handleSortModelChange = (model: GridSortModel) => {
    if (!model.length) return;
    const formatedSortField = model[0].sort === 'asc' ? '' : '-';
    const sortParams = `${formatedSortField}${model[0].field}`;

    setSort(sortParams);
  };

  const fetchList = useCallback(async (params: FetchList) => {
    setLoading(true);

    try {
      const data = await reportingService.getWaterfallReport({ params });

      setData(data);
    } catch (e) {
      Logger.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const buildWaterfallParams = ({
    sort,
    inputFilters,
    dateFrom,
    dateTo
  }: {
    sort: string;
    inputFilters: InputFiltersType;
    dateFrom: Dayjs | null;
    dateTo: Dayjs | null;
  }) => ({
    sortBy: sort,
    pageSize: 10000, // temporary desion to retrive all records
    stack: inputFilters.stack || undefined,
    campaign: inputFilters.campaignId || undefined,
    startTime: dateFrom ? getDateInUTC(dateFrom).toISOString() : undefined,
    endTime: dateTo ? getDateInUTC(dateTo).toISOString() : undefined
  });

  const fetch = useCallback(() => {
    const params = buildWaterfallParams({
      sort,
      inputFilters,
      dateFrom,
      dateTo
    });
    void fetchList(params);
  }, [sort, inputFilters, dateFrom, dateTo]);

  useEffect(() => fetch(), [fetch]);

  const handleExportWaterfallReports = useCallback(async () => {
    const params = buildWaterfallParams({
      sort,
      inputFilters,
      dateFrom,
      dateTo
    });
    return reportingService.getWaterfallReportExportCSV({ params });
  }, [sort, inputFilters, dateFrom, dateTo]);

  return (
    <Box sx={{ padding: '16px 24px' }}>
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
          <ExportCSVButton
            defaultFileName={DEFAULT_EXPORT_FILE_NAME}
            exportFile={handleExportWaterfallReports}
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
          disableColumnMenu
          hideFooter
          autoHeight={rows.length * TABLE.ROW_HEIGHT < TABLE.HEIGHT}
          sx={{ height: TABLE.HEIGHT }}
          columnHeaderHeight={TABLE.COLUMN_HEIGHT}
          rowHeight={TABLE.ROW_HEIGHT}
          // We have border bottom 1px for each row, to include it in rowHeight calculation need also add spacing here
          getRowSpacing={() => ({ bottom: 1 })}
          rowSpacingType="border"
          pinnedRows={{ bottom: aggregationTotalRow }}
          rows={rows}
          columns={columns}
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
    </Box>
  );
};

export default Waterfall;
