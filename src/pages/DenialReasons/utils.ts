import { COLUMN_IDS, IFilters } from './types';

import { DenialReasonsReport } from '@domain/denielReasonsReports';
import { getDateInUTC } from '@utils/date';
import { buildDynamicLINQFilterQuery } from '@utils/filters';

export const getFormattedRows = (data: DenialReasonsReport[]) =>
  data.map((row, index) => {
    const { denialReason, deniedBy, totalCount, percentage } = row;

    return {
      id: index,
      data: row,
      [COLUMN_IDS.denialReason]: denialReason ?? '-',
      [COLUMN_IDS.deniedBy]: deniedBy ?? '-',
      [COLUMN_IDS.totalCount]: totalCount ?? '-',
      [COLUMN_IDS.percentage]: percentage ?? '-'
    };
  });

export const buildParams = ({
  sort,
  filters
}: {
  sort: string;
  filters: IFilters;
}) => {
  const date = {
    from: filters.date.from
      ? getDateInUTC(filters.date.from).toISOString()
      : undefined,
    to: filters.date.to
      ? getDateInUTC(filters.date.to).toISOString()
      : undefined
  };

  return {
    sort,
    filter: buildDynamicLINQFilterQuery({ ...filters, date })
  };
};
