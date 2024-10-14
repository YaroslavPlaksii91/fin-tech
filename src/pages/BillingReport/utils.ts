import { COLUMN_IDS } from './types';

import { BillingReport } from '@domain/billingReport';

export const getFormattedRows = (data: BillingReport['item2']) =>
  data.map((row, index) => ({
    id: index,
    data: row,
    [COLUMN_IDS.month]: row.month ?? '-',
    [COLUMN_IDS.vendorName]: row.vendorName ?? '-',
    [COLUMN_IDS.looks]: row.looks ?? '-',
    [COLUMN_IDS.cost]: row.cost ?? '-'
  }));
