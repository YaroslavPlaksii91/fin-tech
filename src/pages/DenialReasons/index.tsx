import { useCallback, useEffect, useState } from 'react';
import buildQuery from 'odata-query';
import {
  GRID_AGGREGATION_FUNCTIONS,
  GridSortModel
} from '@mui/x-data-grid-premium';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';

import { COLUMN_IDS, FetchList, IDateFilters, RowData } from './types';
import { getFormattedRows } from './utils';
import getDataGridColumns from './columns';
import {
  DEFAULT_EXPORT_FILE_NAME,
  DEFAULT_SORT,
  INITIAL_DATE_FILTERS
} from './constants';

import { StyledDataGridPremium } from '@components/shared/Table/styled';
import { theme } from '@theme';
import { reportingService } from '@services/reports';
import Logger from '@utils/logger';
import { TABLE } from '@constants/themeConstants';
import TuneIcon from '@icons/tune.svg';
import ExportCSVButton from '@components/shared/ExportCSVButton';
import { removeSingleQuotesODataParams } from '@utils/helpers';
import { getDateInUTC } from '@utils/date';
import CustomNoResultsOverlay from '@components/shared/Table/CustomNoResultsOverlay';
import Filters, { IFormState } from '@components/DenialReasons/Filters';

const DenialReasons = () => {
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [rows, setRows] = useState<RowData[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [dateFilters, setDateFilters] =
    useState<IDateFilters>(INITIAL_DATE_FILTERS);
  const [denialReasons, setDenialReasons] = useState('');
  const [deniedBy, setDeniedBy] = useState('');

  const handleFiltersOpen = () => setIsFiltersOpen(true);

  const handleFiltersClose = () => setIsFiltersOpen(false);

  const handleFiltersReset = () => {
    setDateFilters(INITIAL_DATE_FILTERS);
    setDenialReasons('');
    setDeniedBy('');
    handleFiltersClose();
  };

  const handleSubmit = (data: IFormState) => {
    setDateFilters(data.dateFilters);
    setDenialReasons(data.denialReasons);
    setDeniedBy(data.deniedBy);
    handleFiltersClose();
  };

  const handleSortModelChange = (model: GridSortModel) => {
    if (!model.length) return;

    const sortParams = `${model[0].field} ${model[0].sort}`;
    setSort(sortParams);
  };

  const buildOdataParams = ({
    sort,
    filters: { startDate, endDate, deniedBy, rejectionReason }
  }: FetchList): string => {
    const queries = {
      orderBy: sort,
      count: true,
      filter: {
        deniedBy: deniedBy || undefined,
        rejectionReason: rejectionReason || undefined,
        date: {
          ge: startDate ? getDateInUTC(startDate).toISOString() : undefined,
          le: endDate ? getDateInUTC(endDate).toISOString() : undefined
        }
      }
    };

    // We need to replace default odata $filter with entityFilter,
    // Because this is expected on backend for this Report
    const params = buildQuery(queries).replace('$filter', 'entityFilter');

    return removeSingleQuotesODataParams(params);
  };

  const fetchList = async ({ sort, filters }: FetchList) => {
    setLoading(true);

    const correctedParams = buildOdataParams({ sort, filters });

    try {
      const data =
        await reportingService.getDenialReasonsReport(correctedParams);
      const rows = getFormattedRows(data.value);

      setRows(rows);
    } catch (e) {
      Logger.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetch = () => {
    const params: FetchList = {
      sort,
      filters: {
        deniedBy,
        startDate: dateFilters.from,
        endDate: dateFilters.to,
        rejectionReason: denialReasons
      }
    };

    void fetchList(params);
  };

  useEffect(() => fetch(), [sort, dateFilters, deniedBy, denialReasons]);

  const handleExportDenialReasonReports = useCallback(async () => {
    const params: FetchList = {
      sort,
      filters: {
        deniedBy,
        startDate: dateFilters.from,
        endDate: dateFilters.to,
        rejectionReason: denialReasons
      }
    };
    const correctedParams = buildOdataParams(params);
    return reportingService.getDenialReasonsReportExportCSV(correctedParams);
  }, [sort, dateFilters, deniedBy, denialReasons]);

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
        dateFilters={dateFilters}
        denialReasons={denialReasons}
        deniedBy={deniedBy}
        onReset={handleFiltersReset}
        onSubmit={handleSubmit}
        onClose={handleFiltersClose}
      />
    </Box>
  );
};

export default DenialReasons;
