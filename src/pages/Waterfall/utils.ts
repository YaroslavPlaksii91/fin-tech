import { EXTERNAL_SYSTEM_KEYS } from './constants';
import { COLUMN_IDS } from './types';

import { WaterfallReport } from '@domain/waterfallReport';

export const getExternalSystemsColumns = (data: WaterfallReport['item2']) => {
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

export const getFormattedRows = (data: WaterfallReport['item2']) =>
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
      [COLUMN_IDS.totalApprovalRate]: row.totalApprovalRate || '-',
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
