import { COLUMN_IDS } from './types';

import { DenialReasonsReport } from '@domain/denielReasonsReports';

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
