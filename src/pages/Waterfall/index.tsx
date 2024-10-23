import { useCallback, useEffect, useMemo, useState } from 'react';
import { GridSortModel } from '@mui/x-data-grid-premium';
import { Box, Stack, Typography } from '@mui/material';

import { FetchData, IFilters } from './types';
import { getFormattedRows, buildParams } from './utils';
import getDataGridColumns from './columns';
import {
  DEFAULT_EXPORT_FILE_NAME,
  DEFAULT_SORT,
  INITIAL_FILTERS,
  TOTAL_ROW_NAME
} from './constants';
import { StyledDataGridPremium } from './styled';

import { reportingService } from '@services/reports';
import Logger from '@utils/logger';
import { TABLE } from '@constants/themeConstants';
import { WaterfallReport } from '@domain/waterfallReport';
import ExportCSVButton from '@components/shared/Buttons/ExportCSV';
import CustomNoResultsOverlay from '@components/shared/Table/CustomNoResultsOverlay';
import Filters from '@components/Waterfall/Filters';
import FiltersButton from '@components/shared/Buttons/Filters';
import Paper from '@components/shared/Paper';

const Waterfall = () => {
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [data, setData] = useState<WaterfallReport[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<IFilters>(INITIAL_FILTERS);

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
    async () =>
      reportingService.getWaterfallReportExportCSV({
        params: buildParams({ sort, filters })
      }),
    [sort, filters]
  );

  useEffect(() => {
    void fetchData(buildParams({ sort, filters }));
  }, [sort, filters]);

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
          <FiltersButton onClick={handleFiltersOpen} />
        </Stack>
      </Stack>
      <Paper>
        <StyledDataGridPremium
          disableColumnMenu
          hideFooter
          autoHeight={rows.length * TABLE.ROW_HEIGHT < TABLE.HEIGHT}
          sx={{ height: TABLE.HEIGHT }}
          columnHeaderHeight={TABLE.COLUMN_HEIGHT}
          rowHeight={TABLE.ROW_HEIGHT}
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
        onReset={handleFiltersReset}
        onSubmit={handleSubmit}
        onClose={handleFiltersClose}
      />
    </Box>
  );
};

export default Waterfall;
