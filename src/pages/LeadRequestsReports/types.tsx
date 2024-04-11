import { RemoveRedEyeOutlinedIcon } from '@components/shared/Icons';

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
  promoCode = 'leadRequest/customFields/promoCode',
  store = 'output/store',
  ssn = 'leadRequest/ssn',
  email = 'leadRequest/email',
  state = 'leadRequest/state',
  decision = 'output/decision',
  denialReason = 'output/denialReason',
  apiVersion = 'processingMetadata/apiVersion',
  totalTime = 'processingMetadata/processingTime',
  cachedConnector = 'processingMetadata/cachedConnector',
  details = 'details'
}
interface Column {
  id: COLUMN_IDS;
  label: string;
  align?: 'left' | 'center';
}

const columns: readonly Column[] = [
  { id: COLUMN_IDS.requestId, label: 'Request ID' },
  { id: COLUMN_IDS.loanId, label: 'Loan ID' },
  { id: COLUMN_IDS.leadProvider, label: 'Lead Provider' },
  { id: COLUMN_IDS.leadCampaign, label: 'Lead Campaign' },
  { id: COLUMN_IDS.customerId, label: 'Customer ID' },
  { id: COLUMN_IDS.leadPrice, label: 'Lead Price' },
  { id: COLUMN_IDS.affiliate, label: 'Affiliate' },
  { id: COLUMN_IDS.requestDate, label: 'Request date' },
  { id: COLUMN_IDS.requestedAmount, label: 'Request amount' },
  { id: COLUMN_IDS.stackName, label: 'Stack Name' },
  { id: COLUMN_IDS.promoCode, label: 'Promo Code' },
  { id: COLUMN_IDS.store, label: 'Store' },
  { id: COLUMN_IDS.ssn, label: 'SSN' },
  { id: COLUMN_IDS.email, label: 'Email' },
  { id: COLUMN_IDS.decision, label: 'Decision' },
  { id: COLUMN_IDS.denialReason, label: 'Denial Reason' },
  { id: COLUMN_IDS.state, label: 'State' },
  { id: COLUMN_IDS.apiVersion, label: 'API Version' },
  { id: COLUMN_IDS.totalTime, label: 'Total Time(sec)' },
  { id: COLUMN_IDS.cachedConnector, label: 'Cached Connector' },
  {
    id: COLUMN_IDS.details,
    label: '',
    width: 45,
    renderCell: () => (
      <>
        <RemoveRedEyeOutlinedIcon />
      </>
    )
  }
];

// const dataGridColumns: GridColDef[] = columns.map((col) => ({
//   field: col.id,
//   headerName: col.label,
//   align: col.align,
//   headerAlign: col.align,
//   renderCell: col.renderCell
// }));
export { columns };
