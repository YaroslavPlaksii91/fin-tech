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
  filters: IFilters;
};

export interface IDateFilter {
  from: Dayjs | null;
  to: Dayjs | null;
}

export interface IRangeFilter {
  from: string;
  to: string;
}

export enum RANGE_FILTERS_KEYS {
  leadPrice = 'leadPrice'
}

export type IFilters = {
  leadCampaign: string[];
  state: string[];
  stack: string[];
  deniedBy: string[];
  rejectionReason: string;
  [RANGE_FILTERS_KEYS.leadPrice]: IRangeFilter;
  date: IDateFilter;
};
