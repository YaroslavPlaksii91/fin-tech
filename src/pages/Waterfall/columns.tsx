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
    // type: 'number'
  },
  {
    field: COLUMN_IDS.totalApproved,
    headerName: 'Total Approved'
    // type: 'number'
  },
  {
    field: COLUMN_IDS.totalApprovalRate,
    headerName: 'Total Approval Rate'
    // type: 'number'
  },
  {
    field: COLUMN_IDS.totalCost,
    headerName: 'Total Cost'
    // type: 'number'
  },
  {
    field: COLUMN_IDS.totalCpa,
    headerName: 'Total CPA'
    // type: 'number'
  },
  {
    field: COLUMN_IDS.totalLeadCost,
    headerName: 'Total Lead Cost'
    // type: 'number'
  },
  {
    field: COLUMN_IDS.totalDataCost,
    headerName: 'Total Data Cost'
    // type: 'number'
  },
  {
    field: COLUMN_IDS.totalTimeouts,
    headerName: 'Total Timeouts'
    // type: 'number'
  },
  {
    field: COLUMN_IDS.totalCostSavings,
    headerName: 'Total Cost Savings'
    // type: 'number'
  },
  {
    field: COLUMN_IDS.totalCachedLead,
    headerName: 'Total Cached Lead'
    // type: 'number'
  }
  // {
  //   field: COLUMN_IDS.percentage,
  //   headerName: 'Percentage of Total',
  //   type: 'number',
  //   minWidth: 200,
  //   valueFormatter: (value) => {
  //     if (!value) return null;
  //     const factor = Math.pow(10, 2);

  //     return `${Math.round(value * factor) / factor}%`;
  //   }
  // }
];

export default getDataGridColumns;
