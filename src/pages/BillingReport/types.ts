import { getFormattedRows } from './utils';

import { ExtractArrayElementType } from '@utils/types';

export enum COLUMN_IDS {
  month = 'month',
  vendorName = 'vendorName',
  looks = 'looks',
  cost = 'cost'
}

export type RowData = ExtractArrayElementType<
  ReturnType<typeof getFormattedRows>
>;
