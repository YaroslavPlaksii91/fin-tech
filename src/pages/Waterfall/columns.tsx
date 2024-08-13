import { GridColDef } from '@mui/x-data-grid-premium';

import { COLUMN_IDS } from './types';
import { getExternalSystemsColumns } from './utils';
import { EXTERNAL_SYSTEM_KEYS, GROUP_COLORS_NAMES } from './constants';

import { WaterfallReport } from '@domain/waterfallReport';

const STATIC_COLUMNS: GridColDef[] = [
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
    headerName: 'Total Approval Rate',
    valueFormatter: (value: number) => `${value}%`
  },
  {
    field: COLUMN_IDS.totalCost,
    headerName: 'Total Cost',
    valueFormatter: (value: number) => `$${value}`
  },
  {
    field: COLUMN_IDS.totalCpa,
    headerName: 'Total CPA',
    valueFormatter: (value: number) => `$${value}`
  },
  {
    field: COLUMN_IDS.totalLeadCost,
    headerName: 'Total Lead Cost',
    valueFormatter: (value: number) => `$${value}`
  },
  {
    field: COLUMN_IDS.totalDataCost,
    headerName: 'Total Data Cost',
    valueFormatter: (value: number) => `$${value}`
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

const getDataGridColumns = (data: WaterfallReport['item2']) => {
  const externalSystemsColumns = getExternalSystemsColumns(data);

  const dynamicColumns: GridColDef[] = externalSystemsColumns.map(
    (column, index) => ({
      field: column,
      sortable: false,
      disableReorder: true,
      cellClassName: () => {
        const colorGroupIndex =
          Math.floor(index / EXTERNAL_SYSTEM_KEYS.length) %
          GROUP_COLORS_NAMES.length;

        return GROUP_COLORS_NAMES[colorGroupIndex];
      },
      headerName: column
        .split('/')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      renderCell: (params) => (params.value as string) ?? '-'
    })
  );

  return [...STATIC_COLUMNS, ...dynamicColumns];
};

export default getDataGridColumns;
