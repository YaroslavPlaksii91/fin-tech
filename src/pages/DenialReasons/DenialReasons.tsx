import { useCallback, useEffect, useState } from 'react';
import { GridSortModel } from '@mui/x-data-grid-premium';
import LinearProgress from '@mui/material/LinearProgress';

import { FetchList, RowData } from './types';
import { buildParams, getFormattedRows } from './utils';
import getDataGridColumns from './columns';
import {
  AGGREGATION_FUNCTIONS,
  AGGREGATION_MODEL,
  DEFAULT_EXPORT_FILE_NAME,
  DEFAULT_SORT,
  INITIAL_FILTERS
} from './constants';

import { reportingService } from '@services/reports';
import Logger from '@utils/logger';
import ExportCSVButton from '@components/shared/Buttons/ExportCSV';
import Filters from '@components/DenialReasons/Filters';
import FiltersButton from '@components/shared/Buttons/Filters';
import Paper from '@components/shared/Paper';
import useFilters from '@hooks/useFilters';
import DataGrid from '@components/shared/Table/DataGrid';
import { TABLE_WRAPPER_HEIGHT } from '@constants/themeConstants';
import { Wrapper } from '@components/Layouts/styled';
import PageHeader from '@components/Layouts/PageHeader';

const DenialReasons = () => {
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [rows, setRows] = useState<RowData[]>([]);

  const {
    isFiltersOpen,
    filters,
    handleFiltersOpen,
    handleFiltersClose,
    handleFiltersSubmit,
    handleFiltersReset
  } = useFilters(INITIAL_FILTERS);

  const handleSortModelChange = (model: GridSortModel) => {
    const sortParams = `${model[0].field} ${model[0].sort}`;
    setSort(sortParams);
  };

  const fetchList = async (data: FetchList) => {
    setLoading(true);

    const params = buildParams(data);

    try {
      const data = await reportingService.getDenialReasonsReport({ params });
      const rows = getFormattedRows(data);

      setRows(rows);
    } catch (e) {
      Logger.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchList({ sort, filters });
  }, [sort, filters]);

  const handleExport = useCallback(async () => {
    const params = buildParams({ sort, filters });
    return reportingService.getDenialReasonsReportExportCSV({ params });
  }, [sort, filters]);

  return (
    <Wrapper>
      <PageHeader title="Denial Reasons">
        <ExportCSVButton
          defaultFileName={DEFAULT_EXPORT_FILE_NAME}
          exportFile={handleExport}
        />
        <FiltersButton onClick={handleFiltersOpen} />
      </PageHeader>
      <Paper>
        <DataGrid
          hideFooter
          rows={rows}
          aggregationFunctions={AGGREGATION_FUNCTIONS}
          aggregationModel={AGGREGATION_MODEL}
          columns={getDataGridColumns()}
          loading={loading}
          sortingMode="server"
          onSortModelChange={handleSortModelChange}
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

export default DenialReasons;
