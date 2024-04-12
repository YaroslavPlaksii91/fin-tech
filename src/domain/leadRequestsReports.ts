export interface LeadRequestsReportsOData {
  '@odata.context': string;
  '@odata.count': number;
  value: LeadRequestsReports[];
}
export interface LeadRequestsReports {
  id: string;
  leadResponse: LeadResponse;
  leadRequest: LeadRequest;
  output: null | Output;
  processingMetadata: null | ProcessingMetadata;
}

type LeadResponse = {
  loanId: null | string;
  customerId: null | string;
  leadPrice?: null | string;
};

type LeadRequest = {
  requestId: string;
  leadProviderId: string;
  campaignId: string;
  affiliateId: string;
  requestedAmount: number;
  ssn: string;
  email: string;
  state: string;
  customFields: CustomFields;
};

type Output = {
  stack: string;
  store: string;
  decision: string;
  denialReason: string;
};

type ProcessingMetadata = {
  processingDateTimeUtc: string;
  apiVersion: string;
  processingTime: number;
  cachedConnector: string;
};

type CustomFields = {
  promoCode: string;
};
