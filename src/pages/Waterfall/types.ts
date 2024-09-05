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

export type RowData = ExtractArrayElementType<
  ReturnType<typeof getFormattedRows>
>;

export type FetchList = GetWaterfallReport['params'];

export interface IDateFilters {
  from: Dayjs | null;
  to: Dayjs | null;
}
