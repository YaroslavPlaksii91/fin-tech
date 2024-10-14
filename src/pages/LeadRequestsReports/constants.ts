import { COLUMN_IDS, IFilters, RANGE_FILTERS_KEYS } from './types';

import { INITIAL_DATE_FILTERS, INITIAL_RANGE_FILTER } from '@constants/filters';

export const DEFAULT_SORT = `${COLUMN_IDS.requestDate} desc`;

export const DEFAULT_EXPORT_FILE_NAME = 'lead-request-reports';

export const INITIAL_FILTERS: IFilters = {
  requestId: '',
  loanId: '',
  customerId: '',
  affiliate: '',
  ssn: '',
  email: '',
  denialReason: '',
  apiVersion: '',
  cachedConnector: '',
  state: [],
  decision: [],
  stackName: [],
  loanType: [],
  promoCode: [],
  store: [],
  leadProvider: [],
  leadCampaign: [],
  requestDate: INITIAL_DATE_FILTERS,
  [RANGE_FILTERS_KEYS.leadPrice]: INITIAL_RANGE_FILTER,
  [RANGE_FILTERS_KEYS.requestedAmount]: INITIAL_RANGE_FILTER
};
