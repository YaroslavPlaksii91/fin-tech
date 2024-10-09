import { EXTERNAL_SYSTEM_KEYS } from './constants';
import { COLUMN_IDS, IFilters } from './types';

import { typeSafeObjectEntries } from '@utils/object';
import { WaterfallReport } from '@domain/waterfallReport';
import { getDateInUTC } from '@utils/date';

export const getExternalSystemsColumns = (data: WaterfallReport[]) => {
  const setOfExternalSystemNames = new Set<string>();

  data.forEach((row) => {
    row.externalSystemsData.forEach((system, index) =>
      setOfExternalSystemNames.add(system.name || `System ${index}`)
    );
  });

  return Array.from(setOfExternalSystemNames)
    .map((systemName) =>
      EXTERNAL_SYSTEM_KEYS.map((systemKey) => `${systemName}/${systemKey}`)
    )
    .flat(1);
};

export const getFormattedRows = (data: WaterfallReport[]) =>
  data.map((row, index) => {
    const extractedExternalSystemsData = row.externalSystemsData.reduce(
      (rowAcc, system) => ({
        ...rowAcc,
        ...EXTERNAL_SYSTEM_KEYS.reduce(
          (acc, key) => ({
            ...acc,
            [`${system.name}/${key}`]: system[key]
          }),
          {}
        )
      }),
      {}
    );

    return {
      id: index,
      data: row,
      [COLUMN_IDS.stack]: row.stack || '-',
      [COLUMN_IDS.campaignId]: row.campaignId || '-',
      [COLUMN_IDS.totalLooks]: row.totalLooks || '-',
      [COLUMN_IDS.totalApproved]: row.totalApproved || '-',
      [COLUMN_IDS.totalApprovalRate]: Number(row.totalApprovalRate) || '-',
      [COLUMN_IDS.totalCost]: row.totalCost || '-',
      [COLUMN_IDS.totalCpa]: row.totalCpa || '-',
      [COLUMN_IDS.totalLeadCost]: row.totalLeadCost || '-',
      [COLUMN_IDS.totalDataCost]: row.totalDataCost || '-',
      [COLUMN_IDS.totalTimeouts]: row.totalTimeouts || '-',
      [COLUMN_IDS.totalCostSavings]: row.totalCostSavings || '-',
      [COLUMN_IDS.totalCachedLead]: row.totalCachedLead || '-',
      ...extractedExternalSystemsData
    };
  });

const buildDynamicLINQFilterQuery = (filters: Omit<IFilters, 'date'>) =>
  typeSafeObjectEntries(filters).reduce((acc, [key, value]) => {
    let query: string | undefined;
    const isRange = 'from' in value && 'to' in value;
    const isMultiSelection = Array.isArray(value);

    if (
      (isRange && !value.from && !value.to) ||
      (isMultiSelection && !value.length)
    )
      return acc;

    if (isRange) {
      const toQuery = `${key} <= ${value.to}`;
      const fromQuery = `${key} >= ${value.from}`;

      switch (true) {
        case Boolean(value.to && value.from):
          query = `${fromQuery} and ${toQuery}`;
          break;
        case Boolean(value.to):
          query = toQuery;
          break;
        case Boolean(value.from):
          query = fromQuery;
          break;
        default:
          break;
      }
    }

    if (isMultiSelection)
      query = `${key} in (${value.map((el) => `"${el}"`).join(', ')})`;

    if (!acc.length) return query || acc;

    return query ? `${acc} && ${query}` : acc;
  }, '');

export const buildParams = ({
  sort,
  filters: { date, ...filters }
}: {
  sort: string;
  filters: IFilters;
}) => ({
  sort,
  filter: buildDynamicLINQFilterQuery(filters) || undefined,
  startTime: date.from ? getDateInUTC(date.from).toISOString() : undefined,
  endTime: date.to ? getDateInUTC(date.to).toISOString() : undefined
});
