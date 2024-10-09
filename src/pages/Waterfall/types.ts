import { Dayjs } from 'dayjs';

import { getFormattedRows } from './utils';

import { GetWaterfallReport } from '@domain/waterfallReport';
import { ExtractArrayElementType } from '@utils/types';

export enum COLUMN_IDS {
  stack = 'stack',
  campaignId = 'campaignId',
  totalLooks = 'totalLooks',
  totalApproved = 'totalApproved',
  totalApprovalRate = 'totalApprovalRate',
  totalCost = 'totalCost',
  totalCpa = 'totalCpa',
  totalLeadCost = 'totalLeadCost',
  totalDataCost = 'totalDataCost',
  totalTimeouts = 'totalTimeouts',
  totalCostSavings = 'totalCostSavings',
  totalCachedLead = 'totalCachedLead'
}

export enum RANGE_FILTERS_KEYS {
  totalLooks = 'totalLooks',
  totalApproved = 'totalApproved',
  totalApprovalRate = 'totalApprovalRate',
  totalCost = 'totalCost',
  totalCPA = 'totalCPA',
  totalLeadCost = 'totalLeadCost',
  totalDataCost = 'totalDataCost',
  totalTimeouts = 'totalTimeouts',
  totalCostSavings = 'totalCostSavings',
  totalCachedLead = 'totalCachedLead'
}

export type RangeFiltersKey = `${RANGE_FILTERS_KEYS}`;

export type RowData = ExtractArrayElementType<
  ReturnType<typeof getFormattedRows>
>;

export type FetchData = GetWaterfallReport['params'];

export interface IDateFilter {
  from: Dayjs | null;
  to: Dayjs | null;
}

export interface IRangeFilter {
  from: string;
  to: string;
}

export interface IFilters {
  stack: string[];
  campaignId: string[];
  date: IDateFilter;
  [RANGE_FILTERS_KEYS.totalLooks]: IRangeFilter;
  [RANGE_FILTERS_KEYS.totalApproved]: IRangeFilter;
  [RANGE_FILTERS_KEYS.totalApprovalRate]: IRangeFilter;
  [RANGE_FILTERS_KEYS.totalCost]: IRangeFilter;
  [RANGE_FILTERS_KEYS.totalCPA]: IRangeFilter;
  [RANGE_FILTERS_KEYS.totalLeadCost]: IRangeFilter;
  [RANGE_FILTERS_KEYS.totalDataCost]: IRangeFilter;
  [RANGE_FILTERS_KEYS.totalTimeouts]: IRangeFilter;
  [RANGE_FILTERS_KEYS.totalCostSavings]: IRangeFilter;
  [RANGE_FILTERS_KEYS.totalCachedLead]: IRangeFilter;
}
