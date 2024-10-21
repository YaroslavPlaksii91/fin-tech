import { useCallback, useEffect, useState } from 'react';
import {
  GRID_AGGREGATION_FUNCTIONS,
  GridSortModel
} from '@mui/x-data-grid-premium';
import { Box, Stack, Typography } from '@mui/material';

import { COLUMN_IDS, FetchList, IFilters, RowData } from './types';
import { buildParams, getFormattedRows } from './utils';
import getDataGridColumns from './columns';
import {
  DEFAULT_EXPORT_FILE_NAME,
  DEFAULT_SORT,
  INITIAL_FILTERS
} from './constants';

import { StyledDataGridPremium } from '@components/shared/Table/styled';
import { reportingService } from '@services/reports';
import Logger from '@utils/logger';
import { TABLE } from '@constants/themeConstants';
import ExportCSVButton from '@components/shared/Buttons/ExportCSV';
import CustomNoResultsOverlay from '@components/shared/Table/CustomNoResultsOverlay';
import Filters from '@components/DenialReasons/Filters';
import FiltersButton from '@components/shared/Buttons/Filters';
import Paper from '@components/shared/Paper';

const DenialReasons = () => {
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [rows, setRows] = useState<RowData[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<IFilters>(INITIAL_FILTERS);

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

  const handleExportDenialReasonReports = useCallback(async () => {
    const params = buildParams({ sort, filters });
    return reportingService.getDenialReasonsReportExportCSV({ params });
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
        <Typography variant="h4">Denial Reasons</Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <ExportCSVButton
            defaultFileName={DEFAULT_EXPORT_FILE_NAME}
            exportFile={handleExportDenialReasonReports}
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
          // We have border bottom 1px for each row, to include it in rowHeight calculation need also add spacing here
          getRowSpacing={() => ({ bottom: 1 })}
          rowSpacingType="border"
          rows={rows}
          aggregationFunctions={{
            totalLabel: {
              apply: () => 'Total',
              label: ''
            },
            // To not show the header aggregation label for columns in aggregationModel according to design
            sum: { ...GRID_AGGREGATION_FUNCTIONS.sum, label: '' }
          }}
          aggregationModel={{
            [COLUMN_IDS.denialReason]: 'totalLabel',
            [COLUMN_IDS.totalCount]: 'sum',
            [COLUMN_IDS.percentage]: 'sum'
          }}
          columns={getDataGridColumns()}
          loading={loading}
          sortingMode="server"
          paginationMode="client"
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

export default DenialReasons;
