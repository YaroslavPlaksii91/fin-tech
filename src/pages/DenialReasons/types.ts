import { Dayjs } from 'dayjs';

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
  filters: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    rejectionReason?: string;
    deniedBy?: string;
  };
};
