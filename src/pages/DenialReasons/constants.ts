import { IFilters, RANGE_FILTERS_KEYS } from './types';

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
