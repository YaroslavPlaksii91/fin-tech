import { RANGE_FILTERS_KEYS, RangeFiltersKey } from './types';

import { INITIAL_RANGE_FILTER, INITIAL_DATE_FILTERS } from '@constants/filters';
import { RangeFilter } from '@utils/filters';

export const DEFAULT_SORT = 'totalLooks asc';
export const TOTAL_ROW_NAME = 'Total';

export const GROUP_COLORS_NAMES = [
  'lightBlue',
  'teal',
  'lightGreen',
  'deepPurple'
] as const;

export const EXTERNAL_SYSTEM_KEYS = [
  'looks',
  'accepted',
  'cost',
  'savings',
  'timeouts'
] as const;

export const DEFAULT_EXPORT_FILE_NAME = 'waterfall-reports';

export const RANGE_FILTERS_GROUPS = [
  {
    name: RANGE_FILTERS_KEYS.totalLooks,
    title: 'Total Looks'
  },
  {
    name: RANGE_FILTERS_KEYS.totalApproved,
    title: 'Total Approved'
  },
  {
    name: RANGE_FILTERS_KEYS.totalApprovalRate,
    title: 'Approval Rate'
  },
  {
    name: RANGE_FILTERS_KEYS.totalCost,
    title: 'Total Cost',
    symb: '$'
  },
  {
    name: RANGE_FILTERS_KEYS.totalCPA,
    title: 'Total CPA',
    symb: '$'
  },
  {
    name: RANGE_FILTERS_KEYS.totalLeadCost,
    title: 'Total Lead Cost',
    symb: '$'
  },
  {
    name: RANGE_FILTERS_KEYS.totalDataCost,
    title: 'Total Data Cost',
    symb: '$'
  },
  {
    name: RANGE_FILTERS_KEYS.totalTimeouts,
    title: 'Total Timeouts'
  },
  {
    name: RANGE_FILTERS_KEYS.totalCostSavings,
    title: 'Total Cost Savings',
    symb: '$'
  },
  {
    name: RANGE_FILTERS_KEYS.totalCachedLeads,
    title: 'Total Cached Leads'
  }
];

export const INITIAL_FILTERS = {
  stack: [],
  campaignId: [],
  date: INITIAL_DATE_FILTERS,
  ...RANGE_FILTERS_GROUPS.reduce(
    (acc, { name }) => ({ ...acc, [name]: INITIAL_RANGE_FILTER }),
    {} as Record<RangeFiltersKey, RangeFilter>
  )
};
