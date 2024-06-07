import { useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';
import { DataGridPremium, GridSortModel } from '@mui/x-data-grid-premium';
import { DateRange } from '@mui/x-date-pickers-pro';
import { Stack, Typography } from '@mui/material';
import buildQuery from 'odata-query';

import { FetchList, OdataQueries, RowData } from './types';
import { getFormattedRows } from './utils';
import {
  DEFAULT_SORT,
  PAGE_SIZE,
  SHORTCUTS_DATE_ITEMS,
  TODAY,
  dataGridColumns
} from './constants';

import { reportingService } from '@services/lead-requests-reports';
import Logger from '@utils/logger';
import DataGridPagination from '@components/shared/DataGridPagination';
import { StepContainer as Container } from '@views/styled';
import { combineDateAndTime } from '@utils/date';
import DateFilters from '@components/Report/DateFilters';

export default function LeadRequestsReportsPage() {
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [time, setTime] = useState<DateRange<Dayjs>>([null, null]);

  const [date, setDate] = useState<DateRange<Dayjs>>([
    TODAY.startOf('week'),
    TODAY.endOf('week')
  ]);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: PAGE_SIZE,
    page: 0
  });

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
      top: PAGE_SIZE,
      skip: PAGE_SIZE * page,
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
    const params: FetchList = { page: paginationModel.page, sort };

    const startDate = combineDateAndTime(date[0], time[0]);
    const endDate = combineDateAndTime(date[1], time[1]);

    if (startDate && endDate) {
      params.startDate = startDate.toISOString();
      params.endDate = endDate.toISOString();
    }

    void fetchList(params);
  };

  useEffect(() => fetch(), [paginationModel.page, sort]);

  return (
    <Container>
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
        <DataGridPremium
          rows={rows}
          columns={dataGridColumns}
          loading={loading}
          rowCount={totalCount}
          disableColumnMenu={true}
          paginationMode="server"
          sortingMode="server"
          onSortModelChange={handleSortModelChange}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          slots={{ footer: DataGridPagination }}
        />
      </Stack>
    </Container>
  );
}
