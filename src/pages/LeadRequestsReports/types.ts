import { getFormattedRows } from './utils';

import { ExtractArrayElementType } from '@utils/types';
import { DateFilter, RangeFilter } from '@utils/filters';

export enum COLUMN_IDS {
  origin = 'leadRequest.origin',
  requestId = 'leadRequest.requestId',
  loanId = 'leadResponse.loanId',
  leadProvider = 'leadRequest.leadProviderId',
  leadCampaign = 'leadRequest.campaignId',
  customerId = 'leadResponse.customerId',
  leadPrice = 'leadRequest.leadPrice',
  affiliate = 'leadRequest.affiliateId',
  requestDate = 'processingMetadata.executionEndDateTimeUtc',
  requestedAmount = 'leadRequest.requestedAmount',
  stackName = 'output.stack',
  loanType = 'leadRequest.customFields.requestType',
  promoCode = 'leadRequest.customFields.promoCode',
  store = 'output.store',
  ssn = 'leadRequest.ssn',
  email = 'leadRequest.email',
  decision = 'leadResponse.result',
  deniedBy = 'leadResponse.deniedBy',
  denialReason = 'leadResponse.rejectionReason',
  state = 'leadRequest.state',
  apiVersion = 'processingMetadata.apiVersion',
  totalTime = 'processingMetadata.executionTimeSpan',
  cachedConnector = 'processingMetadata.cachedConnector',
  details = 'details',
  craScore = 'processingMetadata.craScore'
}

export type RowData = ExtractArrayElementType<
  ReturnType<typeof getFormattedRows>
>;

export type FetchList = {
  page: number;
  sort: string;
  rowsPerPage: number;
  filters: IFilters;
};

export enum RANGE_FILTERS_KEYS {
  leadPrice = 'leadPrice',
  requestedAmount = 'requestedAmount'
}

export type IFilters = {
  requestId: string;
  loanId: string;
  leadProvider: string[];
  leadCampaign: string[];
  customerId: string;
  [RANGE_FILTERS_KEYS.leadPrice]: RangeFilter;
  [RANGE_FILTERS_KEYS.requestedAmount]: RangeFilter;
  affiliate: string;
  requestDate: DateFilter;
  stackName: string[];
  loanType: string[];
  promoCode: string[];
  store: string[];
  ssn: string;
  email: string;
  decision: string[];
  denialReason: string;
  state: string[];
  apiVersion: string;
  cachedConnector: string;
};
