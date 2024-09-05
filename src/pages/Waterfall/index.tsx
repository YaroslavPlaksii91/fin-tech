import { useCallback, useEffect, useMemo, useState } from 'react';
import { GridSortModel } from '@mui/x-data-grid-premium';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Dayjs } from 'dayjs';

import { FetchList, IDateFilters } from './types';
import { getFormattedRows } from './utils';
import getDataGridColumns from './columns';
import {
  DEFAULT_EXPORT_FILE_NAME,
  DEFAULT_SORT,
  INITIAL_DATE_FILTERS,
  TOTAL_ROW_NAME
} from './constants';
import { StyledDataGridPremium } from './styled';

import { theme } from '@theme';
import { reportingService } from '@services/reports';
import Logger from '@utils/logger';
import { TABLE } from '@constants/themeConstants';
import TuneIcon from '@icons/tune.svg';
import { WaterfallReport } from '@domain/waterfallReport';
import ExportCSVButton from '@components/shared/ExportCSVButton';
import { getDateInUTC } from '@utils/date';
import CustomNoResultsOverlay from '@components/shared/Table/CustomNoResultsOverlay';
import Filters, { IFormState } from '@components/Waterfall/Filters';

const Waterfall = () => {
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [data, setData] = useState<WaterfallReport>({ item1: 0, item2: [] });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [dateFilters, setDateFilters] =
    useState<IDateFilters>(INITIAL_DATE_FILTERS);
  const [stack, setStack] = useState('');
  const [campaignId, setCampaignId] = useState('');

  const columns = useMemo(() => getDataGridColumns(data.item2), [data.item2]);

  const rows = useMemo(() => getFormattedRows(data.item2), [data.item2]);

  const totalRow = useMemo(
    () => rows.filter((row) => row.stack === TOTAL_ROW_NAME),
    [rows]
  );

  const handleFiltersOpen = () => setIsFiltersOpen(true);

  const handleFiltersClose = () => setIsFiltersOpen(false);

  const handleFiltersReset = () => {
    setDateFilters(INITIAL_DATE_FILTERS);
    setCampaignId('');
    setStack('');
    handleFiltersClose();
  };

  const handleSubmit = (data: IFormState) => {
    setDateFilters(data.dateFilters);
    setCampaignId(data.campaignId);
    setStack(data.stack);
    handleFiltersClose();
  };

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
    stack,
    campaignId,
    dateFrom,
    dateTo
  }: {
    sort: string;
    stack: string;
    campaignId: string;
    dateFrom: Dayjs | null;
    dateTo: Dayjs | null;
  }) => ({
    sortBy: sort,
    pageSize: 10000, // temporary desion to retrive all records
    stack: stack || undefined,
    campaign: campaignId || undefined,
    startTime: dateFrom ? getDateInUTC(dateFrom).toISOString() : undefined,
    endTime: dateTo ? getDateInUTC(dateTo).toISOString() : undefined
  });

  const fetch = useCallback(() => {
    const params = buildWaterfallParams({
      sort,
      stack,
      campaignId,
      dateFrom: dateFilters.from,
      dateTo: dateFilters.to
    });

    void fetchList(params);
  }, [sort, stack, campaignId, dateFilters]);

  useEffect(() => fetch(), [fetch]);

  const handleExportWaterfallReports = useCallback(async () => {
    const params = buildWaterfallParams({
      sort,
      stack,
      campaignId,
      dateFrom: dateFilters.from,
      dateTo: dateFilters.to
    });

    return reportingService.getWaterfallReportExportCSV({ params });
  }, [sort, stack, campaignId, dateFilters]);

  return (
    <Box sx={{ padding: '16px 24px' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        pb={2}
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
          pinnedRows={{ bottom: totalRow }}
          rows={rows}
          columns={columns}
          loading={loading}
          sortingMode="server"
          onSortModelChange={handleSortModelChange}
          getRowClassName={(params) => {
            if (!rows.length) return '';
            return params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd';
          }}
          slots={{ noRowsOverlay: CustomNoResultsOverlay }}
        />
      </Paper>
      <Filters
        isOpen={isFiltersOpen}
        dateFilters={dateFilters}
        stack={stack}
        campaignId={campaignId}
        onReset={handleFiltersReset}
        onSubmit={handleSubmit}
        onClose={handleFiltersClose}
      />
    </Box>
  );
};

export default Waterfall;
