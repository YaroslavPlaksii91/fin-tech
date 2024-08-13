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
    field: COLUMN_IDS.requestId,
    headerName: 'Request ID'
  },
  { field: COLUMN_IDS.loanId, headerName: 'Loan ID' },
  {
    field: COLUMN_IDS.leadProvider,
    headerName: 'Lead Provider'
  },
  { field: COLUMN_IDS.leadCampaign, headerName: 'Lead Campaign' },
  { field: COLUMN_IDS.customerId, headerName: 'Customer ID' },
  { field: COLUMN_IDS.leadPrice, headerName: 'Lead Price' },
  { field: COLUMN_IDS.affiliate, headerName: 'Affiliate' },
  { field: COLUMN_IDS.requestDate, headerName: 'Request date' },
  { field: COLUMN_IDS.requestedAmount, headerName: 'Request amount' },
  { field: COLUMN_IDS.stackName, headerName: 'Stack Name' },
  { field: COLUMN_IDS.loanType, headerName: 'Loan Type' },
  { field: COLUMN_IDS.promoCode, headerName: 'Promo Code' },
  { field: COLUMN_IDS.store, headerName: 'Store' },
  { field: COLUMN_IDS.ssn, headerName: 'SSN' },
  { field: COLUMN_IDS.email, headerName: 'Email' },
  {
    field: COLUMN_IDS.decision,
    headerName: 'Decision',
    align: 'left',
    renderCell: (row) => {
      let color;
      switch (row.value) {
        case 'Approved':
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
  { field: COLUMN_IDS.denialReason, headerName: 'Denial Reason' },
  { field: COLUMN_IDS.state, headerName: 'State' },
  { field: COLUMN_IDS.apiVersion, headerName: 'API Version' },
  { field: COLUMN_IDS.totalTime, headerName: 'Total Time(sec)' },
  { field: COLUMN_IDS.cachedConnector, headerName: 'Cached Connector' },
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
