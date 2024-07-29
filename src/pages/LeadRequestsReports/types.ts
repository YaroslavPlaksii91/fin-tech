import { Dayjs } from 'dayjs';

import { getFormattedRows } from './utils';

import { ExtractArrayElementType } from '@utils/types';

export enum COLUMN_IDS {
  requestId = 'leadRequest/requestId',
  loanId = 'leadResponse/loanId',
  leadProvider = 'leadRequest/leadProviderId',
  leadCampaign = 'leadRequest/campaignId',
  customerId = 'leadResponse/customerId',
  leadPrice = 'leadRequest/leadPrice',
  affiliate = 'leadRequest/affiliateId',
  requestDate = 'processingMetadata/processingDateTimeUtc',
  requestedAmount = 'leadRequest/requestedAmount',
  stackName = 'output/stack',
  loanType = 'leadRequest/customFields/requestType',
  promoCode = 'leadRequest/customFields/promoCode',
  store = 'output/store',
  ssn = 'leadRequest/ssn',
  email = 'leadRequest/email',
  decision = 'leadResponse/decision',
  denialReason = 'leadResponse/rejectionReason',
  state = 'leadRequest/state',
  apiVersion = 'processingMetadata/apiVersion',
  totalTime = 'processingMetadata/processingTime',
  cachedConnector = 'processingMetadata/cachedConnector',
  details = 'details'
}

export type RowData = ExtractArrayElementType<
  ReturnType<typeof getFormattedRows>
>;

export type FiltersParams = {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
};

export type FetchList = {
  page: number;
  sort: string;
  filters: FiltersParams;
};

export type OdataQueries = {
  top?: number;
  skip?: number;
  orderBy: string;
  count?: boolean;
  filter?: Record<string, object>;
};
