import { GridColDef } from '@mui/x-data-grid-premium';

import { COLUMN_IDS } from './types';

const getDataGridColumns = (): GridColDef[] => [
  {
    field: COLUMN_IDS.stack,
    headerName: 'Stack',
    sortable: false
  },
  {
    field: COLUMN_IDS.campaignId,
    headerName: 'Campaign ID',
    sortable: false
  },
  {
    field: COLUMN_IDS.totalLooks,
    headerName: 'Total Looks'
  },
  {
    field: COLUMN_IDS.totalApproved,
    headerName: 'Total Approved'
  },
  {
    field: COLUMN_IDS.totalApprovalRate,
    headerName: 'Total Approval Rate'
  },
  {
    field: COLUMN_IDS.totalCost,
    headerName: 'Total Cost'
  },
  {
    field: COLUMN_IDS.totalCpa,
    headerName: 'Total CPA'
  },
  {
    field: COLUMN_IDS.totalLeadCost,
    headerName: 'Total Lead Cost'
  },
  {
    field: COLUMN_IDS.totalDataCost,
    headerName: 'Total Data Cost'
  },
  {
    field: COLUMN_IDS.totalTimeouts,
    headerName: 'Total Timeouts'
  },
  {
    field: COLUMN_IDS.totalCostSavings,
    headerName: 'Total Cost Savings'
  },
  {
    field: COLUMN_IDS.totalCachedLead,
    headerName: 'Total Cached Lead'
  }
];

export default getDataGridColumns;
