import { gridClasses } from '@mui/x-data-grid-premium';
import { lightBlue, teal, lightGreen, deepPurple } from '@mui/material/colors';

import { EXTERNAL_SYSTEM_KEYS } from './constants';
import { COLUMN_IDS, IFilters } from './types';

import { WaterfallReport } from '@domain/waterfallReport';
import { getDateInUTC } from '@utils/date';
import { buildDynamicLINQFilterQuery } from '@utils/filters';

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

export const getTableStyles = () => ({
  [`& .${gridClasses.row}`]: {
    [`&.even`]: {
      '& .lightBlue': { backgroundColor: lightBlue[50] },
      '& .teal': { backgroundColor: teal[50] },
      '& .lightGreen': { backgroundColor: lightGreen[50] },
      '& .deepPurple': { backgroundColor: deepPurple[50] }
    },
    [`&.odd`]: {
      '& .lightBlue': { backgroundColor: lightBlue[100] },
      '& .teal': { backgroundColor: teal[100] },
      '& .lightGreen': { backgroundColor: lightGreen[100] },
      '& .deepPurple': { backgroundColor: deepPurple[100] }
    }
  }
});
