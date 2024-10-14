import { getFormattedRows } from './utils';

import { WaterfallReportParams } from '@domain/waterfallReport';
import { ExtractArrayElementType } from '@utils/types';
import { DateFilter, RangeFilter } from '@utils/filters';

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

export type FetchData = WaterfallReportParams['params'];

export interface IFilters {
  stack: string[];
  campaignId: string[];
  date: DateFilter;
  [RANGE_FILTERS_KEYS.totalLooks]: RangeFilter;
  [RANGE_FILTERS_KEYS.totalApproved]: RangeFilter;
  [RANGE_FILTERS_KEYS.totalApprovalRate]: RangeFilter;
  [RANGE_FILTERS_KEYS.totalCost]: RangeFilter;
  [RANGE_FILTERS_KEYS.totalCPA]: RangeFilter;
  [RANGE_FILTERS_KEYS.totalLeadCost]: RangeFilter;
  [RANGE_FILTERS_KEYS.totalDataCost]: RangeFilter;
  [RANGE_FILTERS_KEYS.totalTimeouts]: RangeFilter;
  [RANGE_FILTERS_KEYS.totalCostSavings]: RangeFilter;
  [RANGE_FILTERS_KEYS.totalCachedLead]: RangeFilter;
}
