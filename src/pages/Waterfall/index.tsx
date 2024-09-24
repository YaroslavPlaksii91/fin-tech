import { useCallback, useEffect, useMemo, useState } from 'react';
import { GridSortModel } from '@mui/x-data-grid-premium';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';

import { COLUMN_IDS, FetchData, IFilters } from './types';
import { getFormattedRows } from './utils';
import getDataGridColumns from './columns';
import {
  DEFAULT_EXPORT_FILE_NAME,
  DEFAULT_SORT,
  INITIAL_FILTERS,
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
import CustomNoResultsOverlay from '@components/shared/Table/CustomNoResultsOverlay';
import Filters from '@components/Waterfall/Filters';
import { Option } from '@components/shared/Forms/Select';

const Waterfall = () => {
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [data, setData] = useState<WaterfallReport[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<IFilters>(INITIAL_FILTERS);
  const [stackOptions, setStackOptions] = useState<Option[]>([]);
  const [campaignIdOptions, setCampaignIdOptions] = useState<Option[]>([]);

  const columns = useMemo(() => getDataGridColumns(data), [data]);
  const rows = useMemo(() => getFormattedRows(data), [data]);

  const totalRow = useMemo(
    () => rows.filter((row) => row.stack === TOTAL_ROW_NAME),
    [rows]
  );

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

  const handleSortModelChange = useCallback((model: GridSortModel) => {
    if (!model.length) return;
    const sortParams = `${model[0].field} ${model[0].sort}`;

    setSort(sortParams);
  }, []);

  const fetchData = useCallback(async (params: FetchData) => {
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

  const handleExport = useCallback(
    async () => reportingService.getWaterfallReportExportCSV({ params: {} }),
    [sort, filters]
  );

  const getOptions = async () => {
    setLoading(true);
    const [stack, campaignId] = await Promise.allSettled([
      reportingService.getWaterfallReportUniqueValuesByField(COLUMN_IDS.stack),
      reportingService.getWaterfallReportUniqueValuesByField(
        COLUMN_IDS.campaignId
      )
    ]);

    if (stack.status === 'fulfilled' && campaignId.status === 'fulfilled') {
      setStackOptions(stack.value.map((value) => ({ value, label: value })));
      setCampaignIdOptions(
        campaignId.value.map((value) => ({ value, label: value }))
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    void fetchData({});
  }, [sort, filters]);

  useEffect(() => {
    void getOptions();
  }, []);

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
            exportFile={handleExport}
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
        filters={filters}
        stackOptions={stackOptions}
        campaignIdOptions={campaignIdOptions}
        onReset={handleFiltersReset}
        onSubmit={handleSubmit}
        onClose={handleFiltersClose}
      />
    </Box>
  );
};

export default Waterfall;
