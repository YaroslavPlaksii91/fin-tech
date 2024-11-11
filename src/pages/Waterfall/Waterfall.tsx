import { useCallback, useEffect, useMemo, useState } from 'react';
import { GridSortModel } from '@mui/x-data-grid-premium';
import LinearProgress from '@mui/material/LinearProgress';

import { FetchData } from './types';
import { getFormattedRows, buildParams, getTableStyles } from './utils';
import getDataGridColumns from './columns';
import {
  DEFAULT_EXPORT_FILE_NAME,
  DEFAULT_SORT,
  INITIAL_FILTERS,
  TOTAL_ROW_NAME
} from './constants';

import { reportingService } from '@services/reports';
import Logger from '@utils/logger';
import { WaterfallReport } from '@domain/waterfallReport';
import ExportCSVButton from '@components/shared/Buttons/ExportCSV';
import Filters from '@components/Waterfall/Filters';
import FiltersButton from '@components/shared/Buttons/Filters';
import Paper from '@components/shared/Paper';
import useFilters from '@hooks/useFilters';
import DataGrid from '@components/shared/Table/DataGrid';
import { TABLE_WRAPPER_HEIGHT } from '@constants/themeConstants';
import { Wrapper } from '@components/Layouts/styled';
import PageHeader from '@components/Layouts/PageHeader';

const Waterfall = () => {
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [data, setData] = useState<WaterfallReport[]>([]);

  const {
    isFiltersOpen,
    filters,
    handleFiltersOpen,
    handleFiltersClose,
    handleFiltersSubmit,
    handleFiltersReset
  } = useFilters(INITIAL_FILTERS);

  const columns = useMemo(() => getDataGridColumns(data), [data]);
  const rows = useMemo(() => getFormattedRows(data), [data]);

  const pinnedRows = useMemo(
    () => ({ bottom: rows.filter((row) => row.stack === TOTAL_ROW_NAME) }),
    [rows]
  );

  const handleSortModelChange = useCallback((model: GridSortModel) => {
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
    <Wrapper>
      <PageHeader title="Waterfall">
        <ExportCSVButton
          defaultFileName={DEFAULT_EXPORT_FILE_NAME}
          exportFile={handleExport}
        />
        <FiltersButton onClick={handleFiltersOpen} />
      </PageHeader>
      <Paper>
        <DataGrid
          hideFooter
          pinnedRows={pinnedRows}
          rows={rows}
          columns={columns}
          loading={loading}
          sortingMode="server"
          onSortModelChange={handleSortModelChange}
          sx={getTableStyles()}
          wrapperSx={{ maxHeight: TABLE_WRAPPER_HEIGHT }}
          slots={{
            loadingOverlay: () => <LinearProgress />
          }}
        />
      </Paper>
      <Filters
        isOpen={isFiltersOpen}
        filters={filters}
        onReset={handleFiltersReset}
        onSubmit={handleFiltersSubmit}
        onClose={handleFiltersClose}
      />
    </Wrapper>
  );
};

export default Waterfall;
