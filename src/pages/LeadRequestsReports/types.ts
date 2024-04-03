export enum COLUMN_IDS {
  origin = 'origin',
  requestId = 'requestId',
  loanId = 'loadId',
  leadProvider = 'leadProvider',
  leadCampaign = 'leadCampaign',
  customerId = 'customerId',
  leadPrice = 'leadPrice',
  affiliate = 'affiliate',
  requestDate = 'requestDate',
  requestAmount = 'requestAmount',
  stackName = 'stackName',
  promoCode = 'promoCode',
  store = 'store',
  ssn = 'ssn',
  email = 'email',
  state = 'state',
  decision = 'decision',
  deniedBy = 'deniedBy',
  denialReason = 'denialReason',
  apiVersion = 'apiVersion',
  totalTime = 'totalTime',
  cachedConnector = 'cachedConnector'
}
interface Column {
  id: COLUMN_IDS;
  label: string;
  minWidth?: number;
  width?: number | string;
  align?: 'left' | 'center';
}

const columns: readonly Column[] = [
  { id: COLUMN_IDS.origin, label: 'Origin' },
  { id: COLUMN_IDS.requestId, label: 'Request ID' },
  { id: COLUMN_IDS.loanId, label: 'Loan ID' },
  { id: COLUMN_IDS.leadProvider, label: 'Lead Provider' },
  { id: COLUMN_IDS.leadCampaign, label: 'Lead Campaign' },
  { id: COLUMN_IDS.customerId, label: 'Customer ID' },
  { id: COLUMN_IDS.leadPrice, label: 'Lead Price' },
  { id: COLUMN_IDS.affiliate, label: 'Affiliate' },
  { id: COLUMN_IDS.requestDate, label: 'Request date' },
  { id: COLUMN_IDS.requestAmount, label: 'Request amount' },
  { id: COLUMN_IDS.stackName, label: 'Stack Name' },
  // loan type
  { id: COLUMN_IDS.promoCode, label: 'Promo Code' },
  { id: COLUMN_IDS.store, label: 'Store' },
  { id: COLUMN_IDS.ssn, label: 'SSN' },
  { id: COLUMN_IDS.email, label: 'Email' },
  { id: COLUMN_IDS.decision, label: 'Decision' },
  { id: COLUMN_IDS.deniedBy, label: 'Denied By' },
  { id: COLUMN_IDS.denialReason, label: 'Denial Reason' },
  { id: COLUMN_IDS.state, label: 'State' },
  { id: COLUMN_IDS.apiVersion, label: 'API Version' },
  { id: COLUMN_IDS.totalTime, label: 'Total Time(sec)' },
  { id: COLUMN_IDS.cachedConnector, label: 'Cached Connector' }
];

export { columns };
