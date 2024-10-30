import { GRID_AGGREGATION_FUNCTIONS } from '@mui/x-data-grid-premium';

import { COLUMN_IDS, IFilters, RANGE_FILTERS_KEYS } from './types';

import { INITIAL_DATE_FILTERS, INITIAL_RANGE_FILTER } from '@constants/filters';

export const DEFAULT_SORT = 'denialReason asc';

export const DEFAULT_EXPORT_FILE_NAME = 'lead-request-denial-reasons-reports';

export const INITIAL_FILTERS: IFilters = {
  leadCampaign: [],
  state: [],
  stack: [],
  deniedBy: [],
  rejectionReason: '',
  [RANGE_FILTERS_KEYS.leadPrice]: INITIAL_RANGE_FILTER,
  date: INITIAL_DATE_FILTERS
};

export const AGGREGATION_MODEL = {
  [COLUMN_IDS.denialReason]: 'totalLabel',
  [COLUMN_IDS.totalCount]: 'sum',
  [COLUMN_IDS.percentage]: 'sum'
};

export const AGGREGATION_FUNCTIONS = {
  totalLabel: {
    apply: () => 'Total',
    label: ''
  },
  // To not show the header aggregation label for columns in aggregationModel according to design
  sum: { ...GRID_AGGREGATION_FUNCTIONS.sum, label: '' }
};
