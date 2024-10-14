import { IFilters, RANGE_FILTERS_KEYS } from './types';

export const DEFAULT_SORT = 'denialReason asc';

export const DEFAULT_EXPORT_FILE_NAME = 'lead-request-denial-reasons-reports';

export const INITIAL_DATE_FILTERS = {
  from: null,
  to: null
};

export const INITIAL_RANGE_FILTER = { from: '', to: '' };

export const INITIAL_FILTERS: IFilters = {
  leadCampaign: [],
  state: [],
  stack: [],
  deniedBy: [],
  rejectionReason: '',
  [RANGE_FILTERS_KEYS.leadPrice]: INITIAL_RANGE_FILTER,
  date: INITIAL_DATE_FILTERS
};
