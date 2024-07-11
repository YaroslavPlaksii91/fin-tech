import { getFormattedRows } from './utils';

import { ExtractArrayElementType } from '@utils/types';

export enum COLUMN_IDS {
  denialReason = 'denialReason',
  deniedBy = 'deniedBy',
  totalCount = 'totalCount',
  percentage = 'percentage'
}

export type RowData = ExtractArrayElementType<
  ReturnType<typeof getFormattedRows>
>;

export type FetchList = {
  sort: string;
  filter: {
    startDate?: string;
    endDate?: string;
    rejectionReason?: string;
    deniedBy?: string;
  };
};
