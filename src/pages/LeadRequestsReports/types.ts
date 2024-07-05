import { getFormattedRows } from './utils';

import { ExtractArrayElementType } from '@utils/types';

export enum COLUMN_IDS {
  requestId = 'leadRequest/requestId',
  loanId = 'leadResponse/loanId',
  leadProvider = 'leadRequest/leadProviderId',
  leadCampaign = 'leadRequest/campaignId',
  customerId = 'leadResponse/customerId',
  leadPrice = 'leadResponse/leadPrice',
  affiliate = 'leadRequest/affiliateId',
  requestDate = 'processingMetadata/processingDateTimeUtc',
  requestedAmount = 'leadRequest/requestedAmount',
  stackName = 'output/stack',
  loanType = 'leadRequest/customFields/requestType',
  promoCode = 'leadRequest/customFields/promoCode',
  store = 'output/store',
  ssn = 'leadRequest/ssn',
  email = 'leadRequest/email',
  decision = 'output/decision',
  // deniedBy ???
  denialReason = 'output/denialReason',
  state = 'leadRequest/state',
  apiVersion = 'processingMetadata/apiVersion',
  totalTime = 'processingMetadata/processingTime',
  cachedConnector = 'processingMetadata/cachedConnector',
  details = 'details'
}

export type RowData = ExtractArrayElementType<
  ReturnType<typeof getFormattedRows>
>;

export type FetchList = {
  page: number;
  sort: string;
  filter: { startDate?: string; endDate?: string };
};

export type OdataQueries = {
  top: number;
  skip: number;
  orderBy: string;
  count: boolean;
  filter?: Record<string, object>;
};
