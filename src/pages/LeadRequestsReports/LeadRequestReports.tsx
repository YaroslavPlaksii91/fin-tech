import { useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';
import { GridSortModel } from '@mui/x-data-grid-premium';
import { DateRange } from '@mui/x-date-pickers-pro';
import { Stack, Typography, Paper } from '@mui/material';
import buildQuery from 'odata-query';

import { COLUMN_IDS, FetchList, OdataQueries, RowData } from './types';
import { getFormattedRows } from './utils';
import {
  DEFAULT_SORT,
  SHORTCUTS_DATE_ITEMS,
  TODAY,
  dataGridColumns
} from './constants';

import { reportingService } from '@services/lead-requests-reports';
import { combineDateAndTime } from '@utils/date';
import DateFilters from '@components/Report/DateFilters';
import TablePagination from '@components/shared/TablePagination';
import { theme } from '@theme';
import { StyledDataGridPremium } from '@components/shared/Table/styled';
import useTablePagination from '@hooks/useTablePagination';
import Logger from '@utils/logger';

export default function LeadRequestsReportsPage() {
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [totalCount, setTotalCount] = useState(0);
  const [time, setTime] = useState<DateRange<Dayjs>>([null, null]);
  const [date, setDate] = useState<DateRange<Dayjs>>([
    TODAY.startOf('week'),
    TODAY.endOf('week')
  ]);

  const {
    rowsPerPage,
    page,
    totalPages,
    handlePageChange,
    handlePageByInputChange,
    handleRowsPerPageChange
  } = useTablePagination({ totalCount });

  const handleDateReset = () => {
    setDate([null, null]);
    setTime([null, null]);
  };

  const handleSortModelChange = (model: GridSortModel) => {
    const sortParams = `${model[0].field} ${model[0].sort}`;
    setSort(sortParams);
  };

  const fetchList = async ({ page, sort, startDate, endDate }: FetchList) => {
    setLoading(true);

    const queries: OdataQueries = {
      top: rowsPerPage,
      skip: rowsPerPage * page,
      orderBy: sort,
      count: true
    };

    if (startDate && endDate) {
      queries.filter = {
        processingMetadata: {
          processingDateTimeUtc: {
            ge: startDate,
            le: endDate
          }
        }
      };
    }

    const params = buildQuery(queries);

    // Need to remove single quotes from params
    const correctedParams = params.replace(
      /'(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)'/g,
      '$1'
    );

    try {
      const data =
        await reportingService.getLeadRequestsReports(correctedParams);
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
    const params: FetchList = { page, sort };

    const startDate = combineDateAndTime(date[0], time[0]);
    const endDate = combineDateAndTime(date[1], time[1]);

    if (startDate && endDate) {
      params.startDate = startDate.toISOString();
      params.endDate = endDate.toISOString();
    }

    void fetchList(params);
  };

  useEffect(() => fetch(), [page, sort]);

  return (
    <Stack sx={{ padding: '16px 32px' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        overflow="auto"
        spacing={2}
        py={2}
      >
        <Typography variant="h4">Lead requests</Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <DateFilters
            date={date}
            time={time}
            shortcutsDateItems={SHORTCUTS_DATE_ITEMS}
            onDateChange={setDate}
            onTimeChange={setTime}
            onClear={handleDateReset}
            onApply={fetch}
          />
        </Stack>
      </Stack>
      <Paper
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '16px',
          overflow: 'hidden',
          minWidth: '680px'
        }}
      >
        <StyledDataGridPremium
          autoHeight
          disableColumnReorder
          disableColumnMenu
          isRowSelectable={() => false}
          columnHeaderHeight={32}
          rowHeight={28}
          rows={rows}
          rowCount={rowsPerPage}
          columns={dataGridColumns}
          loading={loading}
          sortingMode="server"
          paginationMode="client"
          pinnedColumns={{ right: [COLUMN_IDS.details] }}
          onSortModelChange={handleSortModelChange}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          slots={{
            footer: () => (
              <TablePagination
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
    </Stack>
  );
}
