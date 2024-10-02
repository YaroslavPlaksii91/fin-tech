import { GridColDef } from '@mui/x-data-grid-premium';
import { Button, Typography } from '@mui/material';

import { COLUMN_IDS } from './types';

import { theme } from '@theme';

interface GetDataGridColumnsProps {
  handleDetails: () => void;
}

const getDataGridColumns = ({
  handleDetails
}: GetDataGridColumnsProps): GridColDef[] => [
  {
    field: COLUMN_IDS.origin,
    headerName: 'Origin',
    width: 168
  },
  {
    field: COLUMN_IDS.requestId,
    headerName: 'Request ID',
    width: 280
  },
  { field: COLUMN_IDS.loanId, headerName: 'Loan ID', width: 104 },
  {
    field: COLUMN_IDS.leadProvider,
    headerName: 'Lead Provider',
    width: 168
  },
  { field: COLUMN_IDS.leadCampaign, headerName: 'Lead Campaign', width: 144 },
  { field: COLUMN_IDS.customerId, headerName: 'Customer ID', width: 120 },
  { field: COLUMN_IDS.leadPrice, headerName: 'Lead Price', width: 120 },
  { field: COLUMN_IDS.affiliate, headerName: 'Affiliate', width: 120 },
  { field: COLUMN_IDS.requestDate, headerName: 'Request date', width: 192 },
  {
    field: COLUMN_IDS.requestedAmount,
    headerName: 'Request amount',
    width: 144
  },
  { field: COLUMN_IDS.stackName, headerName: 'Stack Name', width: 120 },
  { field: COLUMN_IDS.loanType, headerName: 'Loan Type', width: 144 },
  { field: COLUMN_IDS.promoCode, headerName: 'Promo Code', width: 144 },
  { field: COLUMN_IDS.store, headerName: 'Store', width: 96 },
  { field: COLUMN_IDS.ssn, headerName: 'SSN', width: 120 },
  { field: COLUMN_IDS.email, headerName: 'Email', width: 304 },
  {
    field: COLUMN_IDS.decision,
    headerName: 'Decision',
    align: 'left',
    width: 104,
    renderCell: (row) => {
      let color;
      switch (row.value) {
        case 'Accepted':
          color = theme.palette.success.main;
          break;
        case 'Denied':
          color = theme.palette.error.main;
          break;
        default:
          color = undefined;
      }

      return (
        <Typography
          sx={{ display: 'inline-flex' }}
          color={color}
          variant="body2"
        >
          {row.value}
        </Typography>
      );
    }
  },
  { field: COLUMN_IDS.denialReason, headerName: 'Denial Reason', width: 440 },
  { field: COLUMN_IDS.state, headerName: 'State', width: 120 },
  { field: COLUMN_IDS.apiVersion, headerName: 'API Version', width: 120 },
  { field: COLUMN_IDS.totalTime, headerName: 'Total Time(sec)', width: 144 },
  {
    field: COLUMN_IDS.cachedConnector,
    headerName: 'Cached Connector',
    width: 168
  },
  {
    field: COLUMN_IDS.details,
    headerName: '',
    pinnable: true,
    sortable: false,
    resizable: false,
    width: 75,
    align: 'center',
    renderCell: () => (
      <Button size="small" variant="text" onClick={handleDetails}>
        Details
      </Button>
    )
  }
];

export default getDataGridColumns;
