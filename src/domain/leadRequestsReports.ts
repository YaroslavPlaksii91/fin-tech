export interface LeadRequestsReportsOData {
  '@odata.context': string;
  '@odata.count': number;
  value: LeadRequestsReport[];
}

export interface LeadRequestsReport {
  id: null | string;
  correlationId: string;
  leadResponse: LeadResponse;
  leadRequest: LeadRequest;
  output: null | Output;
  processingMetadata: null | ProcessingMetadata;
  executionHistory: null | ExecutionHistory;
  isPreProcessedForBillingReporting: null | boolean;
  createdDateTimeUtc: string;
  modifiedDateTimeUtc: string;
}

type ExecutionHistory = {
  externalCalls: null | ExternalCall[];
  steps: null | Step[];
};

type ExternalCall = {
  callType: null | string;
  controlFile: null | string;
  executionTimeSpan: null | number;
  isCached: null | boolean;
  result: null | string;
  invokedServices: null | string[];
  requestJson: null | string;
  responseJson: null | string;
  detailedResults: null | DetailedResult;
};

type DetailedResult = Record<string, string | number | boolean>;

type Step = {
  stepId: string;
  stepName: null | string;
  stepType: string;
  nextStepId: null | string;
  subflowId: null | string;
};

type LeadResponse = {
  id: null | string;
  result: string;
  redirectUrl: null | string;
  loanId: null | number;
  customerId: null | number;
  leadPrice: null | number;
  rejectionReason: null | string;
  deniedBy: null | string;
};

type LeadRequest = {
  requestId: null | string;
  leadProviderId: null | string;
  campaignId: null | string;
  origin: null | string;
  affiliateId: null | string;
  affiliateSubId: null | string;
  leadPrice: number;
  applicationWebsite: null | string;
  requestedAmount: null | string;
  ipAddress: number;
  ssn: null | string;
  dateOfBirth: string;
  gender: string;
  firstName: null | string;
  middleInitial: null | string;
  lastName: null | string;
  address: null | string;
  address2: null | string;
  city: null | string;
  state: null | string;
  zipCode: null | string;
  homePhone: null | string;
  mobilePhone: null | string;
  workPhone: null | string;
  contactTime: null | string;
  isMilitary: boolean;
  residenceType: string;
  email: null | string;
  residenceMonths: number;
  isCitizen: number;
  isSubscribedFutureOffers: number;
  numInstallments: number;
  language: null | string;
  incomeType: string;
  paymentType: string;
  employmentType: string;
  employmentMonths: number;
  employerName: null | string;
  employmentAddress: null | string;
  employmentAddress2: null | string;
  employmentCity: null | string;
  employmentState: null | string;
  employmentZipCode: null | string;
  employerPhone: null | string;
  employmentPhoneExt: null | string;
  employmentFax: null | string;
  supervisorName: null | string;
  supervisorPhone: null | string;
  supervisorPhoneExt: null | string;
  jobTitle: null | string;
  workShift: string;
  payFrequency: string;
  lastPayDate: string;
  nextPayDate: string;
  secondNextPayDate: string;
  netMonthlyIncome: number;
  grossMonthlyIncome: number;
  bankAccountHolder: null | string;
  bankName: null | string;
  bankPhone: null | string;
  bankAccountType: string;
  bankRoutingNumber: null | string;
  bankAccountNumber: null | string;
  bankMonths: null | number;
  isDirectDeposit: boolean;
  outstandingAmount: null | number;
  referenceFirstName: null | string;
  referenceLastName: null | string;
  referencePhone: null | string;
  referenceRelationship: string;
  trackingPair: null | string;
  driversLicenseState: null | string;
  driversLicenseNumber: null | string;
  customFields: CustomFields;
};

type Output = {
  stack: string;
  store: string;
  decision: string;
  denialReason: string;
};

type ProcessingMetadata = {
  apiVersion: null | string;
  executionTimeSpan: null | number;
  cachedConnector: null | string;
  executionStartDateTimeUtc: string;
  executionEndDateTimeUtc: string;
};

type CustomFields = {
  promoCode: null | string;
  hasDebitCard: null | boolean;
  accountBalance: null | number;
  isBankrupt: null | boolean;
  requestType: string;
  storeKey: null | string;
  costType: null | string;
};
